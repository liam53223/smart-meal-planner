// Dynamic Relationship Engine - Intelligent Expansion/Contraction Based on Context
// Incorporates all research data from comprehensive questionnaire

import { PrismaClient } from '@prisma/client';
import { ChromaClient } from 'chromadb';

interface QueryContext {
  query: string;
  userProfile: {
    // Demographics & Goals (from research)
    age: number;
    gender: string;
    activityLevel: string;
    primaryGoal: string; // weight_loss, muscle_gain, medical_condition
    secondaryGoals: string[];
    
    // Health & Medical (from research)
    healthConditions: string[];
    allergies: string[];
    medications: string[];
    nutrientDeficiencies: string[];
    
    // Constraints & Preferences (from research)
    cookingSkill: number; // 1-5
    maxPrepTime: number;
    budget: string;
    appliances: string[];
    cuisinePreferences: string[];
    spiceTolerance: number; // 1-5
    
    // Behavioral Patterns (from research)
    portionControlMotivation: number; // 1-5
    habitChangeReadiness: string[];
    socialEatingPattern: number; // 1-5
    successTrackingPreference: string;
    
    // Learned Preferences (from feedback)
    likedIngredients: Record<string, number>;
    dislikedIngredients: Record<string, number>;
    successfulRecipes: string[];
    failedRecipes: string[];
  };
  intentStrength: number; // 0-1 (how specific vs exploratory)
}

export class DynamicRelationshipEngine {
  private prisma: PrismaClient;
  private vectorDB: ChromaClient;
  
  // Dynamic relationship weights based on research
  private relationshipWeights = {
    health: {
      diabetes: { carbs: 0.9, sugar: 0.95, fiber: 0.8, glycemicIndex: 0.85 },
      heartDisease: { saturatedFat: 0.9, sodium: 0.85, omega3: 0.8 },
      pcos: { glycemicIndex: 0.9, antiInflammatory: 0.85, protein: 0.7 },
      ibs: { fodmap: 0.95, fiber: 0.7, fermented: 0.6 }
    },
    goals: {
      weightLoss: { calories: 0.9, protein: 0.7, fiber: 0.8, satiety: 0.85 },
      muscleGain: { protein: 0.95, calories: 0.7, carbs: 0.8, timing: 0.6 },
      antiAging: { antioxidants: 0.9, omega3: 0.8, micronutrients: 0.85 }
    },
    behavioral: {
      lowMotivation: { simplicity: 0.9, time: 0.85, familiarity: 0.7 },
      highMotivation: { variety: 0.8, complexity: 0.6, novelty: 0.7 },
      socialEater: { presentation: 0.8, shareability: 0.85, portions: 0.7 }
    }
  };

  constructor() {
    this.prisma = new PrismaClient();
    this.vectorDB = new ChromaClient();
  }

  // Main intelligent query processing
  async processQuery(context: QueryContext): Promise<any> {
    // Determine relationship expansion/contraction level
    const expansionLevel = this.calculateExpansionLevel(context);
    
    // Build dynamic search parameters
    const searchParams = this.buildDynamicSearchParams(context, expansionLevel);
    
    // Execute multi-dimensional search
    const results = await this.executeIntelligentSearch(searchParams, context);
    
    // Apply personalized ranking
    return this.applyPersonalizedRanking(results, context);
  }

  // Calculate how broad or narrow the search should be
  private calculateExpansionLevel(context: QueryContext): number {
    const factors = {
      // Specific queries get narrow search
      querySpecificity: this.analyzeQuerySpecificity(context.query),
      
      // Users with strict constraints get narrow search
      constraintStrictness: this.calculateConstraintStrictness(context.userProfile),
      
      // Exploratory intent gets broader search
      exploratoryIntent: 1 - context.intentStrength,
      
      // New users get broader options
      userExperience: Math.min(context.userProfile.successfulRecipes.length / 50, 1),
      
      // Time pressure narrows search
      timePressure: context.userProfile.maxPrepTime < 20 ? 0.3 : 0.7
    };

    // Weighted combination
    const expansion = 
      factors.querySpecificity * 0.3 +
      factors.constraintStrictness * 0.25 +
      factors.exploratoryIntent * 0.2 +
      factors.userExperience * 0.15 +
      factors.timePressure * 0.1;

    return expansion; // 0 = very narrow, 1 = very broad
  }

  // Build search parameters that adapt to context
  private buildDynamicSearchParams(context: QueryContext, expansion: number) {
    const profile = context.userProfile;
    
    // Base parameters
    const params: any = {
      // Time constraints with intelligent flexibility
      maxPrepTime: profile.maxPrepTime * (1 + expansion * 0.3), // Allow 30% flex if broad
      maxCookTime: this.estimateCookTimePreference(profile) * (1 + expansion * 0.4),
      
      // Complexity adapts to skill and motivation
      maxComplexity: this.calculateAdaptiveComplexity(profile, expansion),
      
      // Health requirements with priority weighting
      healthFilters: this.buildHealthFilters(profile, expansion),
      
      // Ingredient preferences with fuzzy matching
      ingredientWeights: this.buildIngredientWeights(profile, expansion),
      
      // Appliance requirements with alternatives
      applianceOptions: this.buildApplianceOptions(profile, expansion),
      
      // Cultural/cuisine flexibility
      cuisineFlexibility: this.buildCuisineFlexibility(profile, expansion)
    };

    // Apply research-based adjustments
    this.applyResearchBasedAdjustments(params, profile);
    
    return params;
  }

  // Analyze how specific the query is
  private analyzeQuerySpecificity(query: string): number {
    const specificityMarkers = {
      exact: ['exactly', 'specific', 'only', 'must'],
      moderate: ['similar', 'like', 'around', 'about'],
      broad: ['any', 'something', 'ideas', 'suggestions']
    };

    let score = 0.5; // neutral
    
    Object.entries(specificityMarkers).forEach(([level, markers]) => {
      if (markers.some(m => query.toLowerCase().includes(m))) {
        score = level === 'exact' ? 0.2 : level === 'moderate' ? 0.5 : 0.8;
      }
    });

    return score;
  }

  // Calculate constraint strictness from profile
  private calculateConstraintStrictness(profile: any): number {
    const factors = [
      profile.allergies.length * 0.1,
      profile.healthConditions.length * 0.15,
      profile.budget === 'budget' ? 0.2 : 0,
      profile.maxPrepTime < 15 ? 0.2 : 0,
      profile.cookingSkill < 2 ? 0.15 : 0
    ];

    return Math.max(0, 1 - factors.reduce((a, b) => a + b, 0));
  }

  // Build health filters with intelligent priority
  private buildHealthFilters(profile: any, expansion: number) {
    const filters: any = {};
    
    // Apply condition-specific filters from research
    profile.healthConditions.forEach((condition: string) => {
      const weights = this.relationshipWeights.health[condition as keyof typeof this.relationshipWeights.health];
      if (weights) {
        Object.entries(weights).forEach(([nutrient, importance]) => {
          // Stricter filtering for important nutrients when narrow search
          filters[nutrient] = {
            importance: importance as number,
            flexibility: expansion * (1 - (importance as number))
          };
        });
      }
    });

    // Goal-based filters
    const goalWeights = this.relationshipWeights.goals[profile.primaryGoal as keyof typeof this.relationshipWeights.goals];
    if (goalWeights) {
      Object.entries(goalWeights).forEach(([factor, importance]) => {
        filters[factor] = {
          importance: importance as number,
          flexibility: expansion * 0.3
        };
      });
    }

    return filters;
  }

  // Build ingredient weights with learned preferences
  private buildIngredientWeights(profile: any, expansion: number) {
    const weights: Record<string, number> = {};
    
    // Strong preferences (from feedback)
    Object.entries(profile.likedIngredients).forEach(([ing, score]) => {
      weights[ing] = (score as number) * (2 - expansion); // Less important in broad search
    });
    
    // Dislikes are always avoided
    Object.entries(profile.dislikedIngredients).forEach(([ing, score]) => {
      weights[ing] = (score as number) * -2; // Always negative
    });
    
    // Cultural preferences influence ingredient selection
    profile.cuisinePreferences.forEach((cuisine: string) => {
      const typicalIngredients = this.getCuisineIngredients(cuisine);
      typicalIngredients.forEach(ing => {
        weights[ing] = (weights[ing] || 0) + 0.5 * expansion;
      });
    });
    
    return weights;
  }

  // Build appliance options with intelligent alternatives
  private buildApplianceOptions(profile: any, expansion: number) {
    const primary = profile.appliances;
    const alternatives: Record<string, string[]> = {
      'oven': ['air fryer', 'toaster oven'],
      'stovetop': ['electric skillet', 'hot plate'],
      'instant pot': ['slow cooker', 'stovetop pressure cooker'],
      'air fryer': ['oven', 'convection oven']
    };
    
    let options = [...primary];
    
    // Add alternatives based on expansion level
    if (expansion > 0.5) {
      primary.forEach((appliance: string) => {
        const alts = alternatives[appliance.toLowerCase()];
        if (alts) {
          options.push(...alts.slice(0, Math.floor(expansion * alts.length)));
        }
      });
    }
    
    return [...new Set(options)];
  }

  // Multi-dimensional intelligent search
  private async executeIntelligentSearch(params: any, context: QueryContext) {
    // Vector similarity search with dynamic radius
    const vectorRadius = 0.3 + (params.expansion * 0.4); // 0.3-0.7 based on expansion
    
    const vectorResults = await this.vectorDB.collection('recipes').query({
      query_texts: [context.query],
      n_results: Math.floor(20 + params.expansion * 30), // 20-50 results
      where: this.buildVectorFilters(params)
    });
    
    // SQL search for structured constraints
    const sqlResults = await this.prisma.recipe.findMany({
      where: this.buildSQLFilters(params),
      include: {
        nutritionalInfo: true,
        spiceBlends: true,
        feedbacks: {
          where: { userId: context.userProfile.id }
        }
      }
    });
    
    // Merge and deduplicate results
    return this.mergeSearchResults(vectorResults, sqlResults, params);
  }

  // Apply personalized ranking based on all factors
  private applyPersonalizedRanking(results: any[], context: QueryContext) {
    return results.map(recipe => {
      let score = 0;
      
      // Health alignment score
      score += this.calculateHealthAlignment(recipe, context.userProfile) * 0.25;
      
      // Preference alignment score
      score += this.calculatePreferenceAlignment(recipe, context.userProfile) * 0.20;
      
      // Behavioral fit score
      score += this.calculateBehavioralFit(recipe, context.userProfile) * 0.15;
      
      // Complexity match score
      score += this.calculateComplexityMatch(recipe, context.userProfile) * 0.15;
      
      // Historical success score
      score += this.calculateHistoricalSuccess(recipe, context.userProfile) * 0.15;
      
      // Novelty vs familiarity balance
      score += this.calculateNoveltyBalance(recipe, context.userProfile) * 0.10;
      
      return { ...recipe, personalizedScore: score };
    }).sort((a, b) => b.personalizedScore - a.personalizedScore);
  }

  // Helper methods for research-based calculations
  private calculateHealthAlignment(recipe: any, profile: any): number {
    let score = 0.5;
    
    // Check alignment with health conditions
    profile.healthConditions.forEach((condition: string) => {
      const requirements = this.relationshipWeights.health[condition as keyof typeof this.relationshipWeights.health];
      if (requirements && recipe.nutritionalInfo) {
        // Complex scoring based on nutritional alignment
        score += this.scoreNutritionalAlignment(recipe.nutritionalInfo, requirements);
      }
    });
    
    return Math.min(1, score);
  }

  private calculateBehavioralFit(recipe: any, profile: any): number {
    const behaviorWeights = this.relationshipWeights.behavioral;
    const motivationLevel = profile.portionControlMotivation < 3 ? 'lowMotivation' : 'highMotivation';
    const weights = behaviorWeights[motivationLevel as keyof typeof behaviorWeights];
    
    let score = 0;
    
    if (weights.simplicity && recipe.complexity) {
      score += (5 - recipe.complexity) / 5 * weights.simplicity;
    }
    
    if (weights.time && recipe.totalTimeMinutes) {
      score += Math.max(0, 1 - recipe.totalTimeMinutes / 60) * weights.time;
    }
    
    return score;
  }

  // Cuisine-specific ingredient mapping
  private getCuisineIngredients(cuisine: string): string[] {
    const cuisineMap: Record<string, string[]> = {
      italian: ['tomato', 'basil', 'garlic', 'olive oil', 'parmesan'],
      mexican: ['lime', 'cilantro', 'chili', 'cumin', 'avocado'],
      chinese: ['soy sauce', 'ginger', 'sesame', 'rice wine', 'scallion'],
      indian: ['turmeric', 'cumin', 'coriander', 'garam masala', 'yogurt']
    };
    
    return cuisineMap[cuisine.toLowerCase()] || [];
  }

  // Apply evidence-based adjustments from research
  private applyResearchBasedAdjustments(params: any, profile: any) {
    // Spice blend optimization based on health goals
    if (profile.primaryGoal === 'antiInflammatory' || profile.healthConditions.includes('arthritis')) {
      params.preferredSpiceBlends = ['golden_antiinflammatory', 'green_cardio'];
    }
    
    // Micronutrient optimization for deficiencies
    if (profile.nutrientDeficiencies.length > 0) {
      params.micronutrientPriority = profile.nutrientDeficiencies;
    }
    
    // Behavioral nudges based on research
    if (profile.habitChangeReadiness.includes('meal_prep')) {
      params.batchCookingBonus = 0.2;
    }
  }

  // Estimate cooking time preference from profile
  private estimateCookTimePreference(profile: any): number {
    const base = 45; // minutes
    const adjustments = {
      skill: (profile.cookingSkill - 3) * 5, // +/- based on skill
      motivation: (profile.portionControlMotivation - 3) * 3,
      appliances: profile.appliances.includes('instant pot') ? -15 : 0
    };
    
    return Math.max(10, base + Object.values(adjustments).reduce((a, b) => a + b, 0));
  }

  private calculateAdaptiveComplexity(profile: any, expansion: number): number {
    const baseComplexity = profile.cookingSkill;
    const adjustment = expansion * 1.5; // Allow higher complexity in broad search
    return Math.min(5, baseComplexity + adjustment);
  }

  private scoreNutritionalAlignment(nutrition: any, requirements: any): number {
    // Implementation would check each nutritional requirement
    return 0.7; // Placeholder
  }

  private calculatePreferenceAlignment(recipe: any, profile: any): number {
    // Implementation would check ingredient preferences
    return 0.8; // Placeholder
  }

  private calculateComplexityMatch(recipe: any, profile: any): number {
    const diff = Math.abs(recipe.complexity - profile.cookingSkill);
    return Math.max(0, 1 - diff / 5);
  }

  private calculateHistoricalSuccess(recipe: any, profile: any): number {
    if (recipe.feedbacks && recipe.feedbacks.length > 0) {
      const avgRating = recipe.feedbacks.reduce((sum: number, f: any) => sum + f.rating, 0) / recipe.feedbacks.length;
      return avgRating / 5;
    }
    return 0.5; // Neutral for unrated
  }

  private calculateNoveltyBalance(recipe: any, profile: any): number {
    const isNovel = !profile.successfulRecipes.includes(recipe.id);
    const noveltyPreference = profile.habitChangeReadiness.includes('new_foods') ? 0.7 : 0.3;
    return isNovel ? noveltyPreference : 1 - noveltyPreference;
  }

  private buildVectorFilters(params: any): any {
    // Convert params to vector DB filters
    return {}; // Implementation needed
  }

  private buildSQLFilters(params: any): any {
    // Convert params to Prisma where clause
    return {}; // Implementation needed
  }

  private mergeSearchResults(vectorResults: any, sqlResults: any, params: any): any[] {
    // Merge and deduplicate results
    return []; // Implementation needed
  }
} 