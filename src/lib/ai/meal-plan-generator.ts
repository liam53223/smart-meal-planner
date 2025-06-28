/**
 * AI-Powered Meal Plan Generation System
 * Uses condition-specific prompts and nutritional analysis
 */

import { GeneratedUserProfile, QuestionnaireFlow } from '@/lib/types/questionnaire';
import { Recipe, RecipeFilter, NutritionalInfo } from '@/lib/types/recipe';

// AI Prompt Templates for Different Niches
export const AIPromptTemplates = {
  ibs_fodmap: `Create a 7-day low-FODMAP meal plan for someone with IBS who prefers {prep_time}-minute recipes and has access to {equipment}. 

Key Requirements:
- Strictly avoid high-FODMAP foods (onions, garlic, wheat, certain fruits)
- Include portion modifications and symptom management tips
- Focus on gut-healing ingredients
- Provide alternatives for common trigger foods
- Include timing recommendations for meals

Nutritional Goals:
- Adequate fiber from low-FODMAP sources
- Anti-inflammatory ingredients
- Easily digestible proteins
- Balanced macronutrients to support energy

Please structure each day with breakfast, lunch, dinner, and 2 snacks. Include prep tips and ingredient substitutions.`,

  diabetes: `Generate a diabetic-friendly weekly meal plan focusing on blood sugar management with meals under {prep_time} minutes. 

Key Requirements:
- Include carb counts and glycemic index considerations
- Emphasize complex carbohydrates and fiber
- Balanced protein at each meal
- Portion control guidance
- Blood sugar impact notes

Nutritional Targets:
- 45-65% complex carbohydrates
- 15-20% lean protein
- 20-35% healthy fats
- High fiber content (25-35g daily)
- Low sodium (under 2300mg daily)

Include timing recommendations for meals and snacks to maintain stable blood sugar throughout the day.`,

  weight_loss: `Design a calorie-controlled meal plan for healthy weight loss with {calorie_target} calories per day, emphasizing {macro_preference} and {prep_time}-minute meals.

Key Requirements:
- Create sustainable portion sizes
- Include metabolism-boosting ingredients
- Focus on satiety and satisfaction
- Provide meal timing strategies
- Include hydration recommendations

Nutritional Strategy:
- High protein to preserve muscle mass
- High fiber for satiety
- Balanced macronutrients
- Nutrient-dense, lower-calorie foods
- Strategic meal timing

Ensure each meal is satisfying and includes tips for managing hunger and cravings.`,

  autoimmune_aip: `Create an AIP (Autoimmune Protocol) compliant meal plan for managing autoimmune conditions with {prep_time}-minute recipes.

Key Requirements:
- Eliminate all AIP-restricted foods (grains, legumes, dairy, eggs, nuts, seeds, nightshades)
- Focus on anti-inflammatory ingredients
- Include gut-healing foods and bone broth
- Emphasize nutrient density
- Provide reintroduction guidance

Nutritional Focus:
- High-quality proteins (grass-fed, wild-caught)
- Plenty of vegetables (non-nightshade)
- Healthy fats (coconut, olive oil, avocado)
- Organ meats for nutrient density
- Fermented foods for gut health

Include meal prep strategies and tips for dining out while maintaining AIP compliance.`,

  pcos: `Design a PCOS-friendly meal plan focusing on insulin resistance and hormonal balance with {prep_time}-minute recipes.

Key Requirements:
- Low glycemic index foods
- Anti-inflammatory ingredients
- Hormone-balancing nutrients
- Adequate protein for satiety
- Healthy fats for hormone production

Nutritional Strategy:
- Complex carbohydrates paired with protein
- Omega-3 rich foods
- Antioxidant-rich vegetables
- Spearmint tea and other hormone-supporting herbs
- Balanced meals to prevent blood sugar spikes

Include timing recommendations and lifestyle tips for managing PCOS symptoms through nutrition.`,

  kidney_disease: `Create a kidney-friendly meal plan for stage {stage} chronic kidney disease with {prep_time}-minute recipes.

Key Requirements:
- Control phosphorus, potassium, and sodium
- Moderate protein intake
- Adequate calories for energy
- Fluid considerations
- Medication timing with meals

Nutritional Targets:
- Protein: {protein_target}g per day
- Phosphorus: under {phosphorus_limit}mg
- Potassium: under {potassium_limit}mg
- Sodium: under {sodium_limit}mg

Include cooking methods that reduce mineral content and portion guidance for kidney health.`,

  muscle_gain: `Generate a muscle-building meal plan with {calorie_target} calories focusing on {workout_schedule} training days.

Key Requirements:
- High protein intake (1.6-2.2g per kg body weight)
- Strategic carbohydrate timing around workouts
- Adequate calories for muscle growth
- Recovery-focused nutrition
- Meal timing for optimal muscle protein synthesis

Nutritional Strategy:
- Post-workout protein within 30 minutes
- Complex carbs for sustained energy
- Healthy fats for hormone production
- Adequate hydration for performance
- Micronutrients for recovery

Include pre and post-workout meal suggestions and supplement timing recommendations.`,

  mediterranean: `Create a Mediterranean diet meal plan emphasizing {prep_time}-minute traditional recipes and seasonal ingredients.

Key Requirements:
- Emphasis on olive oil, fish, vegetables, whole grains
- Minimal processed foods
- Seasonal and regional ingredients
- Social dining considerations
- Traditional cooking methods

Nutritional Benefits:
- Heart-healthy fats from olive oil and fish
- Antioxidants from colorful vegetables
- Fiber from whole grains and legumes
- Moderate wine consumption (if appropriate)
- Anti-inflammatory foods

Include cultural context and traditional meal patterns from Mediterranean regions.`
};

// Meal Plan Generation Interface
export interface MealPlanGenerationRequest {
  userProfile: GeneratedUserProfile;
  preferences: {
    startDate: Date;
    duration: number; // days
    mealsPerDay: number;
    snacksPerDay: number;
    avoidIngredients?: string[];
    favoriteIngredients?: string[];
  };
  constraints: {
    maxPrepTime: number;
    equipment: string[];
    budgetRange: 'budget' | 'moderate' | 'premium';
    servings: number;
  };
  nutritionalTargets?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sodium?: number;
  };
}

export interface GeneratedMealPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  duration: number;
  startDate: Date;
  
  // Daily Plans
  days: DailyMealPlan[];
  
  // Nutritional Summary
  nutritionalSummary: WeeklyNutritionalSummary;
  
  // Shopping and Prep
  shoppingList: ShoppingListItem[];
  prepInstructions: MealPrepInstruction[];
  
  // Metadata
  aiPromptUsed: string;
  compatibilityScore: number;
  modifications: string[];
  alternatives: AlternativeMeal[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyMealPlan {
  date: Date;
  dayOfWeek: string;
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  
  meals: {
    breakfast: MealPlanMeal;
    lunch: MealPlanMeal;
    dinner: MealPlanMeal;
    snacks: MealPlanMeal[];
  };
  
  dailyTips?: string[];
  hydrationGoal?: number; // ml
  supplementReminders?: string[];
}

export interface MealPlanMeal {
  id: string;
  name: string;
  recipeId?: string;
  servings: number;
  prepTime: number;
  
  // Nutritional Info
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  
  // Meal-specific info
  ingredients: MealIngredient[];
  instructions: string[];
  tips?: string[];
  modifications?: string[];
  
  // Timing and Context
  recommendedTime?: string;
  contextNotes?: string[];
  allergenWarnings?: string[];
}

export interface MealIngredient {
  name: string;
  amount: number;
  unit: string;
  category: string;
  substitutions?: {
    ingredient: string;
    reason: string;
    amount: number;
    unit: string;
  }[];
}

export interface WeeklyNutritionalSummary {
  averageDaily: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
  
  micronutrients: {
    vitaminC: number;
    vitaminD: number;
    calcium: number;
    iron: number;
    potassium: number;
  };
  
  complianceScore: number; // How well it meets user's requirements
  balanceScore: number; // Nutritional balance score
  varietyScore: number; // Ingredient and cuisine variety
  
  recommendations: string[];
  warnings: string[];
}

export interface ShoppingListItem {
  name: string;
  amount: number;
  unit: string;
  category: string;
  estimatedCost?: number;
  alternatives?: string[];
  storageInstructions?: string;
  usedInMeals: string[];
}

export interface MealPrepInstruction {
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  equipment: string[];
  steps: string[];
  storageInstructions: string;
  shelfLife: number; // days
}

export interface AlternativeMeal {
  originalMealId: string;
  alternativeName: string;
  reason: string;
  nutritionalDifference: string;
  difficultyDifference: string;
}

// Main Meal Plan Generator Class
export class MealPlanGenerator {
  private openaiApiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.openaiApiKey = apiKey;
    this.baseUrl = 'https://api.openai.com/v1';
  }

  /**
   * Generate a personalized meal plan using AI
   */
  async generateMealPlan(request: MealPlanGenerationRequest): Promise<GeneratedMealPlan> {
    try {
      // 1. Determine the appropriate prompt template
      const promptTemplate = this.selectPromptTemplate(request.userProfile);
      
      // 2. Customize the prompt with user-specific data
      const customizedPrompt = this.customizePrompt(promptTemplate, request);
      
      // 3. Generate meal plan using OpenAI
      const aiResponse = await this.callOpenAI(customizedPrompt);
      
      // 4. Parse and structure the response
      const structuredMealPlan = await this.parseAIResponse(aiResponse, request);
      
      // 5. Validate nutritional targets
      const validatedMealPlan = await this.validateNutritionalTargets(structuredMealPlan, request);
      
      // 6. Generate shopping list and prep instructions
      const completeMealPlan = await this.addShoppingAndPrep(validatedMealPlan);
      
      return completeMealPlan;
      
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw new Error('Failed to generate meal plan. Please try again.');
    }
  }

  /**
   * Select appropriate prompt template based on user profile
   */
  private selectPromptTemplate(profile: GeneratedUserProfile): string {
    // Primary health conditions take precedence
    if (profile.healthConditions.length > 0) {
      const primaryCondition = profile.healthConditions[0].condition.toLowerCase();
      
      if (primaryCondition.includes('ibs') || primaryCondition.includes('fodmap')) {
        return AIPromptTemplates.ibs_fodmap;
      }
      if (primaryCondition.includes('diabetes')) {
        return AIPromptTemplates.diabetes;
      }
      if (primaryCondition.includes('autoimmune')) {
        return AIPromptTemplates.autoimmune_aip;
      }
      if (primaryCondition.includes('pcos')) {
        return AIPromptTemplates.pcos;
      }
      if (primaryCondition.includes('kidney')) {
        return AIPromptTemplates.kidney_disease;
      }
    }

    // Fitness goals
    if (profile.primaryGoal === 'weight_loss') {
      return AIPromptTemplates.weight_loss;
    }
    if (profile.primaryGoal === 'muscle_gain') {
      return AIPromptTemplates.muscle_gain;
    }

    // Lifestyle preferences
    if (profile.preferences.cuisinePreferences?.includes('mediterranean')) {
      return AIPromptTemplates.mediterranean;
    }

    // Default to weight management
    return AIPromptTemplates.weight_loss;
  }

  /**
   * Customize prompt template with user-specific data
   */
  private customizePrompt(template: string, request: MealPlanGenerationRequest): string {
    let customized = template;
    
    // Replace placeholders with actual values
    customized = customized.replace('{prep_time}', request.constraints.maxPrepTime.toString());
    customized = customized.replace('{equipment}', request.constraints.equipment.join(', '));
    customized = customized.replace('{calorie_target}', request.nutritionalTargets?.calories?.toString() || '2000');
    customized = customized.replace('{macro_preference}', this.getMacroPreference(request.userProfile));
    
    // Add user-specific constraints
    const constraints = this.buildConstraintsString(request);
    customized += `\n\nAdditional Constraints:\n${constraints}`;
    
    // Add allergy and dietary restrictions
    const restrictions = this.buildRestrictionsString(request.userProfile);
    if (restrictions) {
      customized += `\n\nDietary Restrictions and Allergies:\n${restrictions}`;
    }
    
    return customized;
  }

  /**
   * Call OpenAI API with the customized prompt
   */
  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional nutritionist and meal planning expert. Create detailed, safe, and nutritionally balanced meal plans based on the user\'s specific health conditions and preferences. Always prioritize safety and provide practical, actionable advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Parse AI response into structured meal plan
   */
  private async parseAIResponse(aiResponse: string, request: MealPlanGenerationRequest): Promise<GeneratedMealPlan> {
    // This would involve sophisticated parsing of the AI response
    // For now, returning a structured template
    
    const mealPlan: GeneratedMealPlan = {
      id: this.generateId(),
      userId: request.userProfile.id,
      name: `Personalized ${request.preferences.duration}-Day Meal Plan`,
      description: `AI-generated meal plan based on your ${request.userProfile.primaryGoal} goals`,
      duration: request.preferences.duration,
      startDate: request.preferences.startDate,
      days: [],
      nutritionalSummary: {
        averageDaily: {
          calories: request.nutritionalTargets?.calories || 2000,
          protein: request.nutritionalTargets?.protein || 150,
          carbs: request.nutritionalTargets?.carbs || 250,
          fat: request.nutritionalTargets?.fat || 80,
          fiber: request.nutritionalTargets?.fiber || 30,
          sodium: request.nutritionalTargets?.sodium || 2000,
        },
        micronutrients: {
          vitaminC: 90,
          vitaminD: 600,
          calcium: 1000,
          iron: 18,
          potassium: 3500,
        },
        complianceScore: 95,
        balanceScore: 90,
        varietyScore: 85,
        recommendations: [],
        warnings: [],
      },
      shoppingList: [],
      prepInstructions: [],
      aiPromptUsed: this.selectPromptTemplate(request.userProfile),
      compatibilityScore: 92,
      modifications: [],
      alternatives: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Parse the AI response and populate the meal plan
    // This would involve NLP processing of the AI response
    
    return mealPlan;
  }

  /**
   * Validate that the meal plan meets nutritional targets
   */
  private async validateNutritionalTargets(
    mealPlan: GeneratedMealPlan, 
    request: MealPlanGenerationRequest
  ): Promise<GeneratedMealPlan> {
    // Implement nutritional validation logic
    // Check against user's targets and health conditions
    // Make adjustments if necessary
    
    return mealPlan;
  }

  /**
   * Add shopping list and meal prep instructions
   */
  private async addShoppingAndPrep(mealPlan: GeneratedMealPlan): Promise<GeneratedMealPlan> {
    // Generate comprehensive shopping list
    // Create meal prep instructions
    // Add storage and timing recommendations
    
    return mealPlan;
  }

  // Helper methods
  private getMacroPreference(profile: GeneratedUserProfile): string {
    if (profile.healthConditions.some(c => c.condition.includes('diabetes'))) {
      return 'low glycemic carbohydrates and high fiber';
    }
    if (profile.primaryGoal === 'muscle_gain') {
      return 'high protein';
    }
    if (profile.primaryGoal === 'weight_loss') {
      return 'high protein and fiber for satiety';
    }
    return 'balanced macronutrients';
  }

  private buildConstraintsString(request: MealPlanGenerationRequest): string {
    const constraints = [];
    
    constraints.push(`- Maximum prep time: ${request.constraints.maxPrepTime} minutes`);
    constraints.push(`- Available equipment: ${request.constraints.equipment.join(', ')}`);
    constraints.push(`- Budget range: ${request.constraints.budgetRange}`);
    constraints.push(`- Serving size: ${request.constraints.servings} people`);
    
    if (request.preferences.avoidIngredients?.length) {
      constraints.push(`- Avoid ingredients: ${request.preferences.avoidIngredients.join(', ')}`);
    }
    
    if (request.preferences.favoriteIngredients?.length) {
      constraints.push(`- Preferred ingredients: ${request.preferences.favoriteIngredients.join(', ')}`);
    }
    
    return constraints.join('\n');
  }

  private buildRestrictionsString(profile: GeneratedUserProfile): string {
    const restrictions: string[] = [];
    
    // Add allergies
    profile.allergies.forEach(allergy => {
      restrictions.push(`- ALLERGY (${allergy.severity}): ${allergy.allergen} - ${allergy.avoidanceList.join(', ')}`);
    });
    
    // Add dietary restrictions
    profile.dietaryRestrictions.forEach(restriction => {
      restrictions.push(`- Dietary restriction: ${restriction}`);
    });
    
    return restrictions.join('\n');
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

// Export singleton instance
export const mealPlanGenerator = new MealPlanGenerator(
  process.env.OPENAI_API_KEY || ''
); 