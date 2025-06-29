import { PrismaClient } from '../../generated/prisma';
import { RecipeVectorDB } from '../vector-db/chroma-client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

interface RecipeData {
  name: string;
  description: string;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  appliances?: string[];
  tags?: string[];
  difficulty?: string;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
}

export class MassiveRecipeLoader {
  private vectorDB: RecipeVectorDB;
  private loadedCount = 0;
  
  constructor() {
    this.vectorDB = new RecipeVectorDB();
  }

  async initialize() {
    await this.vectorDB.initialize();
    console.log('Recipe loader initialized');
  }

  // Generate appliance-specific variations using AI
  async generateApplianceVariations(baseRecipe: RecipeData): Promise<RecipeData[]> {
    const variations: RecipeData[] = [];
    const applianceAdaptations = {
      'Air Fryer': {
        timeReduction: 0.7,
        tempIncrease: 25,
        modifications: ['Spray with oil instead of deep frying', 'Reduce cooking time by 30%']
      },
      'Instant Pot': {
        timeReduction: 0.5,
        modifications: ['Add 1 cup liquid', 'Use pressure cook setting', 'Natural release 10 min']
      },
      'Microwave': {
        timeReduction: 0.3,
        modifications: ['Cover with microwave-safe lid', 'Cook in 2-min intervals', 'Let stand 1 min']
      }
    };

    for (const [appliance, adaptation] of Object.entries(applianceAdaptations)) {
      // Check if recipe is suitable for this appliance
      if (this.isSuitableForAppliance(baseRecipe, appliance)) {
        const variation: RecipeData = {
          ...baseRecipe,
          name: `${baseRecipe.name} (${appliance})`,
          prepTime: Math.round(baseRecipe.prepTime * (adaptation.timeReduction || 1)),
          cookTime: Math.round(baseRecipe.cookTime * (adaptation.timeReduction || 1)),
          appliances: [appliance],
          instructions: [
            ...adaptation.modifications,
            ...baseRecipe.instructions
          ]
        };
        variations.push(variation);
      }
    }

    return variations;
  }

  private isSuitableForAppliance(recipe: RecipeData, appliance: string): boolean {
    // Simple heuristics for appliance suitability
    const unsuitable = {
      'Air Fryer': ['soup', 'stew', 'sauce', 'smoothie'],
      'Instant Pot': ['salad', 'sandwich', 'smoothie', 'ice cream'],
      'Microwave': ['crispy', 'grilled', 'roasted', 'caramelized']
    };

    const recipeName = recipe.name.toLowerCase();
    const unsuitableTerms = unsuitable[appliance as keyof typeof unsuitable] || [];
    
    return !unsuitableTerms.some(term => recipeName.includes(term));
  }

  // Load recipes from JSON file
  async loadFromJSON(filePath: string): Promise<number> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const recipes = JSON.parse(data) as RecipeData[];
      
      console.log(`Loading ${recipes.length} recipes from ${filePath}`);
      
      const batchSize = 50;
      for (let i = 0; i < recipes.length; i += batchSize) {
        const batch = recipes.slice(i, i + batchSize);
        await this.processBatch(batch);
        console.log(`Progress: ${i + batch.length}/${recipes.length}`);
      }
      
      return recipes.length;
    } catch (error) {
      console.error(`Error loading from ${filePath}:`, error);
      return 0;
    }
  }

  // Process a batch of recipes
  private async processBatch(recipes: RecipeData[]) {
    const recipesToAdd = [];
    
    for (const recipe of recipes) {
      // Add base recipe
      const baseRecipeData = await this.saveRecipeToDB(recipe);
      recipesToAdd.push(baseRecipeData);
      
      // Generate and add variations
      const variations = await this.generateApplianceVariations(recipe);
      for (const variation of variations) {
        const variationData = await this.saveRecipeToDB(variation);
        recipesToAdd.push(variationData);
      }
    }
    
    // Add to vector database
    await this.vectorDB.addRecipes(recipesToAdd.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description || '',
      ingredients: JSON.parse(r.ingredients),
      appliances: r.appliances ? JSON.parse(r.appliances) : [],
      tags: r.tags ? JSON.parse(r.tags) : [],
      metadata: {
        complexity: r.complexity,
        totalTime: r.totalTime,
        servings: r.servings
      }
    })));
    
    this.loadedCount += recipesToAdd.length;
  }

  // Save recipe to PostgreSQL
  private async saveRecipeToDB(recipe: RecipeData) {
    const totalTime = recipe.prepTime + recipe.cookTime;
    const complexity = this.calculateComplexity(recipe);
    const costTier = this.calculateCostTier(recipe);
    
    return await prisma.recipe.create({
      data: {
        name: recipe.name,
        description: recipe.description || `Delicious ${recipe.name} recipe`,
        ingredients: JSON.stringify(recipe.ingredients),
        instructions: JSON.stringify(recipe.instructions),
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        totalTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty || 'Medium',
        appliances: JSON.stringify(recipe.appliances || []),
        tags: JSON.stringify(recipe.tags || []),
        complexity,
        costTier,
        nutrition: recipe.nutrition ? JSON.stringify(recipe.nutrition) : null,
        healthScore: this.calculateHealthScore(recipe),
        userRatings: '[]',
        createdAt: new Date()
      }
    });
  }

  private calculateComplexity(recipe: RecipeData): number {
    // 1-5 scale based on steps, ingredients, and time
    const factors = {
      ingredients: Math.min(recipe.ingredients.length / 5, 2),
      steps: Math.min(recipe.instructions.length / 5, 2),
      time: Math.min(recipe.prepTime + recipe.cookTime / 30, 1)
    };
    
    return Math.ceil(factors.ingredients + factors.steps + factors.time);
  }

  private calculateCostTier(recipe: RecipeData): string {
    // Estimate based on ingredient count and types
    const expensiveIngredients = ['salmon', 'steak', 'shrimp', 'lobster', 'truffle'];
    const hasExpensive = recipe.ingredients.some(ing => 
      expensiveIngredients.some(exp => ing.name.toLowerCase().includes(exp))
    );
    
    if (hasExpensive) return 'Premium';
    if (recipe.ingredients.length > 10) return 'Moderate';
    return 'Budget';
  }

  private calculateHealthScore(recipe: RecipeData): number {
    if (!recipe.nutrition) return 5; // Default middle score
    
    const { calories, protein, fiber = 0 } = recipe.nutrition;
    const perServing = {
      calories: calories / recipe.servings,
      protein: protein / recipe.servings,
      fiber: fiber / recipe.servings
    };
    
    // Simple health scoring
    let score = 5;
    if (perServing.calories < 400) score += 1;
    if (perServing.calories > 800) score -= 2;
    if (perServing.protein > 20) score += 1;
    if (perServing.fiber > 5) score += 1;
    
    return Math.max(1, Math.min(10, score));
  }

  // Generate sample recipes for testing
  async generateSampleRecipes(count: number) {
    const cuisines = ['Italian', 'Mexican', 'Chinese', 'Indian', 'American'];
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'];
    const appliances = ['Oven', 'Stovetop', 'Air Fryer', 'Instant Pot', 'Microwave'];
    
    const sampleRecipes: RecipeData[] = [];
    
    for (let i = 0; i < count; i++) {
      const cuisine = cuisines[i % cuisines.length];
      const mealType = mealTypes[i % mealTypes.length];
      const appliance = appliances[i % appliances.length];
      
      const recipe: RecipeData = {
        name: `${cuisine} ${mealType} Recipe ${i + 1}`,
        description: `A delicious ${cuisine} ${mealType} perfect for any occasion`,
        ingredients: this.generateIngredients(3 + (i % 7)),
        instructions: this.generateInstructions(4 + (i % 6)),
        prepTime: 5 + (i % 20),
        cookTime: 10 + (i % 50),
        servings: 2 + (i % 4),
        appliances: [appliance],
        tags: [cuisine, mealType, 'quick', 'easy'],
        difficulty: ['Easy', 'Medium', 'Hard'][i % 3],
        nutrition: {
          calories: 200 + (i * 50) % 600,
          protein: 10 + (i % 30),
          carbs: 20 + (i % 50),
          fat: 5 + (i % 25),
          fiber: 2 + (i % 8)
        }
      };
      
      sampleRecipes.push(recipe);
    }
    
    await this.processBatch(sampleRecipes);
    console.log(`Generated and loaded ${count} sample recipes`);
  }

  private generateIngredients(count: number) {
    const ingredients = [
      'onion', 'garlic', 'tomato', 'chicken', 'rice', 'pasta', 
      'cheese', 'milk', 'eggs', 'flour', 'oil', 'salt', 'pepper'
    ];
    
    return Array.from({ length: count }, (_, i) => ({
      name: ingredients[i % ingredients.length],
      amount: 1 + (i % 3),
      unit: ['cup', 'tbsp', 'tsp', 'oz', 'lb'][i % 5]
    }));
  }

  private generateInstructions(count: number) {
    const actions = ['Chop', 'Mix', 'Cook', 'Bake', 'Stir', 'Season', 'Serve'];
    return Array.from({ length: count }, (_, i) => 
      `${actions[i % actions.length]} the ingredients for ${5 + i} minutes`
    );
  }

  async getStats() {
    const dbCount = await prisma.recipe.count();
    const vectorInfo = await this.vectorDB.getCollectionInfo();
    
    return {
      totalRecipesInDB: dbCount,
      totalRecipesInVector: vectorInfo.count,
      loadedThisSession: this.loadedCount,
      vectorDBInfo: vectorInfo
    };
  }
} 