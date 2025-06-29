import { ChromaClient, Collection, EmbeddingFunction } from 'chromadb';

// Custom embedding function that uses Ollama with GPU acceleration
class OllamaEmbeddingFunction {
  private endpoint: string;
  private model: string;

  constructor(endpoint = 'http://localhost:11434', model = 'nomic-embed-text') {
    this.endpoint = endpoint;
    this.model = model;
  }

  async generate(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    
    // Process in batches optimized for RTX 5080
    const batchSize = 32; // RTX 5080 can handle larger batches
    
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchEmbeddings = await Promise.all(
        batch.map(text => this.generateSingle(text))
      );
      embeddings.push(...batchEmbeddings);
    }
    
    return embeddings;
  }

  private async generateSingle(text: string): Promise<number[]> {
    const response = await fetch(`${this.endpoint}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: text
      })
    });

    const data = await response.json() as { embedding: number[] };
    return data.embedding;
  }
}

export class RecipeVectorDB {
  private client: ChromaClient;
  private collection: Collection | null = null;
  private embeddingFunction: OllamaEmbeddingFunction;

  constructor() {
    this.client = new ChromaClient({
      path: process.env.CHROMA_DB_PATH || './chroma-db'
    });
    this.embeddingFunction = new OllamaEmbeddingFunction();
  }

  async initialize() {
    try {
      // Create or get recipe collection
      this.collection = await this.client.getOrCreateCollection({
        name: 'recipes',
        embeddingFunction: this.embeddingFunction,
        metadata: {
          description: 'Recipe embeddings for semantic search',
          created: new Date().toISOString()
        }
      });
      
      console.log('ChromaDB initialized with collection:', this.collection.name);
    } catch (error) {
      console.error('Failed to initialize ChromaDB:', error);
      throw error;
    }
  }

  async addRecipes(recipes: Array<{
    id: string;
    name: string;
    description: string;
    ingredients: string[];
    appliances: string[];
    tags: string[];
    metadata?: any;
  }>) {
    if (!this.collection) throw new Error('Collection not initialized');

    // Prepare documents for embedding
    const documents = recipes.map(recipe => 
      `${recipe.name}. ${recipe.description}. Ingredients: ${recipe.ingredients.join(', ')}. 
       Appliances: ${recipe.appliances.join(', ')}. Tags: ${recipe.tags.join(', ')}.`
    );

    const ids = recipes.map(r => r.id);
    const metadatas = recipes.map(recipe => ({
      name: recipe.name,
      appliances: JSON.stringify(recipe.appliances),
      tags: JSON.stringify(recipe.tags),
      ingredientCount: recipe.ingredients.length,
      ...recipe.metadata
    }));

    // Add in batches optimized for GPU memory
    const batchSize = 100; // RTX 5080 can handle large batches
    
    for (let i = 0; i < documents.length; i += batchSize) {
      const batchDocs = documents.slice(i, i + batchSize);
      const batchIds = ids.slice(i, i + batchSize);
      const batchMeta = metadatas.slice(i, i + batchSize);
      
      await this.collection.add({
        documents: batchDocs,
        ids: batchIds,
        metadatas: batchMeta
      });
      
      console.log(`Added batch ${i / batchSize + 1} of ${Math.ceil(documents.length / batchSize)}`);
    }
  }

  async searchRecipes(
    query: string,
    userProfile: {
      appliances: string[];
      maxPrepTime: number;
      dietaryRestrictions: string[];
      skillLevel: string;
    },
    limit = 10
  ): Promise<any[]> {
    if (!this.collection) throw new Error('Collection not initialized');

    // Enhance query with user context
    const enhancedQuery = `${query}. 
      Available appliances: ${userProfile.appliances.join(', ')}. 
      Max time: ${userProfile.maxPrepTime} minutes. 
      Skill level: ${userProfile.skillLevel}.`;

    // Perform semantic search
    const results = await this.collection.query({
      queryTexts: [enhancedQuery],
      nResults: limit * 2, // Get more to filter
      where: this.buildWhereClause(userProfile)
    });

    // Score and rank results
    const scoredResults = await this.scoreResults(
      results.documents[0] || [],
      results.metadatas[0] || [],
      (results.distances[0] || []).filter((d): d is number => d !== null),
      userProfile
    );

    return scoredResults.slice(0, limit);
  }

  private buildWhereClause(userProfile: any) {
    const where: any = {};
    
    // Filter by available appliances
    if (userProfile.appliances.length > 0) {
      where['$or'] = userProfile.appliances.map((appliance: string) => ({
        appliances: { '$contains': appliance }
      }));
    }
    
    return where;
  }

  private async scoreResults(
    documents: any[],
    metadatas: any[],
    distances: number[],
    userProfile: any
  ): Promise<any[]> {
    const scoredResults = documents.map((doc, index) => {
      const metadata = metadatas[index];
      const distance = distances[index];
      
      // Calculate component scores
      const semanticScore = 1 - distance; // Convert distance to similarity
      
      const applianceScore = this.calculateApplianceScore(
        JSON.parse(metadata.appliances || '[]'),
        userProfile.appliances
      );
      
      const complexityScore = this.calculateComplexityScore(
        metadata.complexity || 3,
        userProfile.skillLevel
      );
      
      // Weighted final score
      const finalScore = (
        semanticScore * 0.4 +
        applianceScore * 0.3 +
        complexityScore * 0.3
      );
      
      return {
        document: doc,
        metadata,
        distance,
        scores: {
          semantic: semanticScore,
          appliance: applianceScore,
          complexity: complexityScore,
          final: finalScore
        }
      };
    });
    
    // Sort by final score
    return scoredResults.sort((a, b) => b.scores.final - a.scores.final);
  }

  private calculateApplianceScore(
    recipeAppliances: string[],
    userAppliances: string[]
  ): number {
    if (recipeAppliances.length === 0) return 1; // No specific appliance needed
    
    const hasRequired = recipeAppliances.every(appliance =>
      userAppliances.includes(appliance)
    );
    
    return hasRequired ? 1 : 0;
  }

  private calculateComplexityScore(
    recipeComplexity: number,
    userSkillLevel: string
  ): number {
    const skillToNumber: Record<string, number> = {
      'Beginner': 2,
      'Intermediate': 3,
      'Advanced': 5
    };
    
    const userSkill = skillToNumber[userSkillLevel] || 3;
    const difference = Math.abs(recipeComplexity - userSkill);
    
    // Perfect match = 1, further away = lower score
    return Math.max(0, 1 - (difference * 0.25));
  }

  async deleteCollection() {
    if (this.collection) {
      await this.client.deleteCollection({ name: 'recipes' });
      this.collection = null;
    }
  }

  async getCollectionInfo() {
    if (!this.collection) throw new Error('Collection not initialized');
    
    const count = await this.collection.count();
    const peek = await this.collection.peek({ limit: 5 });
    
    return {
      name: this.collection.name,
      count,
      sample: peek
    };
  }
} 