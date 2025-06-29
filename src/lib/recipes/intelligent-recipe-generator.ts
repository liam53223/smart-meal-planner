// Intelligent Recipe Generator with AI-Powered Dynamic Generation
import { PrismaClient } from '@prisma/client';
import { HybridAIRouter } from '../ai/hybrid-ai-router';

const prisma = new PrismaClient();

export class IntelligentRecipeGenerator {
  private ai: HybridAIRouter;
  
  constructor() {
    this.ai = new HybridAIRouter();
  }

  // Generate truly unique recipes using AI
  async generateIntelligentRecipe(parameters: {
    userPreferences: any;
    targetAppliance: string;
    healthGoals: string[];
    budget: string;
    timeConstraint: number;
  }) {
    const { userPreferences, targetAppliance, healthGoals, budget, timeConstraint } = parameters;
    
    // Build intelligent prompt based on user data
    const prompt = `Generate a unique recipe with these constraints:
    - Appliance: ${targetAppliance}
    - Max time: ${timeConstraint} minutes
    - Budget: ${budget}
    - Health goals: ${healthGoals.join(', ')}
    - User likes: ${userPreferences.likedIngredients?.join(', ') || 'any'}
    - User dislikes: ${userPreferences.dislikedIngredients?.join(', ') || 'none'}
    
    Create a recipe that:
    1. Is genuinely unique (not a common dish)
    2. Optimized for the specific appliance
    3. Meets the health goals
    4. Uses seasonal ingredients
    5. Has interesting flavor combinations
    
    Format as JSON with: name, description, ingredients (with amounts), instructions, nutrition`;

    const response = await this.ai.route({
      type: 'recipe',
      query: prompt,
      context: parameters
    });
    const recipe = JSON.parse(response.response);
    
    // Apply intelligent enhancements
    return this.enhanceWithIntelligence(recipe, parameters);
  }

  // Multi-factor intelligent enhancement
  private async enhanceWithIntelligence(recipe: any, params: any) {
    return {
      ...recipe,
      
      // Dynamic complexity based on user skill
      complexity: this.calculateAdaptiveComplexity(recipe, params.userPreferences),
      
      // Personalized health score
      healthScore: this.calculatePersonalizedHealthScore(recipe, params.healthGoals),
      
      // Smart cost estimation based on location/season
      estimatedCost: await this.calculateSmartCost(recipe.ingredients),
      
      // AI-generated tips
      proTips: await this.generateProTips(recipe, params.targetAppliance),
      
      // Flavor profile analysis
      flavorProfile: this.analyzeFlavorProfile(recipe.ingredients),
      
      // Nutritional optimization suggestions
      optimizations: await this.suggestOptimizations(recipe, params.healthGoals)
    };
  }

  // Adaptive complexity scoring
  private calculateAdaptiveComplexity(recipe: any, userPrefs: any): number {
    const skillLevel = userPrefs.cookingSkillLevel || 'beginner';
    const skillMultipliers: Record<string, number> = {
      'beginner': 1.5,
      'intermediate': 1.0,
      'advanced': 0.7
    };
    const skillMultiplier = skillMultipliers[skillLevel] || 1.0;

    // Base complexity factors
    const factors = {
      ingredients: recipe.ingredients.length,
      techniques: this.countTechniques(recipe.instructions),
      multitasking: this.assessMultitasking(recipe.instructions),
      precision: this.assessPrecisionRequired(recipe)
    };

    // Weighted calculation
    const baseScore = (
      factors.ingredients * 0.2 +
      factors.techniques * 0.3 +
      factors.multitasking * 0.3 +
      factors.precision * 0.2
    );

    return Math.round(baseScore * skillMultiplier);
  }

  // Personalized health scoring
  private calculatePersonalizedHealthScore(recipe: any, healthGoals: string[]): number {
    let score = 5; // Base score
    
    const goalWeights = {
      'weight_loss': {
        caloriesPerServing: (cal: number) => cal < 400 ? 2 : cal > 600 ? -2 : 0,
        fiberPerServing: (f: number) => f > 5 ? 2 : 0,
        proteinPerServing: (p: number) => p > 20 ? 1 : 0
      },
      'muscle_gain': {
        proteinPerServing: (p: number) => p > 30 ? 3 : p > 20 ? 2 : 0,
        caloriesPerServing: (cal: number) => cal > 500 ? 1 : 0,
        carbsPerServing: (c: number) => c > 40 ? 1 : 0
      },
      'heart_health': {
        saturatedFat: (f: number) => f < 5 ? 2 : f > 10 ? -2 : 0,
        fiber: (f: number) => f > 8 ? 2 : 0,
        sodium: (s: number) => s < 400 ? 2 : s > 800 ? -2 : 0
      }
    };

    // Apply goal-specific scoring
    healthGoals.forEach(goal => {
      const weights = goalWeights[goal as keyof typeof goalWeights];
      if (weights && recipe.nutrition) {
        Object.entries(weights).forEach(([nutrient, scoreFn]) => {
          const value = recipe.nutrition[nutrient] / recipe.servings;
          score += scoreFn(value);
        });
      }
    });

    return Math.max(1, Math.min(10, score));
  }

  // Smart cost calculation with seasonal awareness
  private async calculateSmartCost(ingredients: any[]): Promise<number> {
    const month = new Date().getMonth();
    const seasonalDiscounts = {
      'tomato': [5, 6, 7, 8], // Summer
      'squash': [8, 9, 10],   // Fall
      'citrus': [11, 0, 1],   // Winter
      'asparagus': [2, 3, 4]  // Spring
    };

    let totalCost = 0;
    
    for (const ing of ingredients) {
      let baseCost = await this.getIngredientBaseCost(ing.name);
      
      // Apply seasonal discount
      Object.entries(seasonalDiscounts).forEach(([item, months]) => {
        if (ing.name.toLowerCase().includes(item) && months.includes(month)) {
          baseCost *= 0.7; // 30% discount
        }
      });
      
      totalCost += baseCost * ing.amount;
    }

    return Math.round(totalCost * 100) / 100;
  }

  // Flavor profile analysis
  private analyzeFlavorProfile(ingredients: any[]) {
    const flavorMap = {
      'sweet': ['sugar', 'honey', 'maple', 'carrot', 'sweet potato'],
      'salty': ['salt', 'soy sauce', 'miso', 'anchovy'],
      'sour': ['lemon', 'lime', 'vinegar', 'yogurt'],
      'bitter': ['coffee', 'dark chocolate', 'kale', 'arugula'],
      'umami': ['mushroom', 'tomato', 'parmesan', 'miso', 'soy sauce'],
      'spicy': ['chili', 'pepper', 'ginger', 'cayenne']
    };

    const profile = {
      sweet: 0,
      salty: 0,
      sour: 0,
      bitter: 0,
      umami: 0,
      spicy: 0
    };

    ingredients.forEach(ing => {
      const ingName = ing.name.toLowerCase();
      Object.entries(flavorMap).forEach(([flavor, keywords]) => {
        if (keywords.some(kw => ingName.includes(kw))) {
          profile[flavor as keyof typeof profile] += 1;
        }
      });
    });

    // Identify dominant flavors
    const dominant = Object.entries(profile)
      .filter(([_, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([flavor]) => flavor);

    return {
      profile,
      dominant,
      balance: this.assessFlavorBalance(profile)
    };
  }

  private assessFlavorBalance(profile: any): string {
    const activeFlavorCount = Object.values(profile).filter((v: any) => v > 0).length;
    
    if (activeFlavorCount >= 4) return 'complex';
    if (activeFlavorCount >= 2) return 'balanced';
    return 'simple';
  }

  // Helper methods
  private countTechniques(instructions: string[]): number {
    const techniques = ['sauté', 'roast', 'blanch', 'emulsify', 'fold', 'caramelize'];
    return techniques.filter(t => 
      instructions.some(i => i.toLowerCase().includes(t))
    ).length;
  }

  private assessMultitasking(instructions: string[]): number {
    const simultaneousKeywords = ['while', 'meanwhile', 'at the same time'];
    return instructions.filter(i => 
      simultaneousKeywords.some(kw => i.toLowerCase().includes(kw))
    ).length;
  }

  private assessPrecisionRequired(recipe: any): number {
    const precisionIndicators = ['exact', 'precisely', 'degrees', 'timer'];
    const instructionText = recipe.instructions.join(' ').toLowerCase();
    return precisionIndicators.filter(ind => instructionText.includes(ind)).length;
  }

  private async getIngredientBaseCost(ingredient: string): Promise<number> {
    // In production, this would query a price API or database
    // For now, return estimates
    const costs: Record<string, number> = {
      'chicken': 4.99,
      'rice': 0.50,
      'vegetables': 2.00,
      'spices': 0.25,
      // ... more ingredients
    };
    
    return costs[ingredient.toLowerCase()] || 1.50;
  }

  private async generateProTips(recipe: any, appliance: string): Promise<string[]> {
    const prompt = `Generate 3 professional cooking tips for making ${recipe.name} in a ${appliance}. 
    Make them specific and actionable.`;
    
    const response = await this.ai.query(prompt, 'recipe_tips');
    return JSON.parse(response);
  }

  private async suggestOptimizations(recipe: any, healthGoals: string[]): Promise<any> {
    const prompt = `Suggest healthy modifications for this recipe to better meet these goals: ${healthGoals.join(', ')}.
    Current nutrition per serving: ${JSON.stringify(recipe.nutrition)}
    Suggest specific ingredient swaps or portion adjustments.`;
    
    const response = await this.ai.query(prompt, 'recipe_optimization');
    return JSON.parse(response);
  }
} 