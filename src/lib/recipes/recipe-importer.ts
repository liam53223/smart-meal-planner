import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

interface ImportedRecipe {
  name: string;
  description?: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings?: number;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
    notes?: string;
  }>;
  instructions: string[];
  appliances?: string[];
  tags?: {
    medical?: string[];
    dietary?: string[];
    practical?: string[];
    nutritional?: string[];
  };
  nutrition?: {
    calories?: number;
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    fiber?: number;
    sodium?: number;
  };
}

export class RecipeImporter {
  async importRecipes(recipes: ImportedRecipe[]): Promise<{
    imported: number;
    failed: number;
    errors: string[];
  }> {
    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const recipe of recipes) {
      try {
        await this.importSingleRecipe(recipe);
        imported++;
      } catch (error) {
        failed++;
        errors.push(`Failed to import "${recipe.name}": ${error}`);
      }
    }

    return { imported, failed, errors };
  }

  async importSingleRecipe(recipe: ImportedRecipe) {
    // Validate required fields
    if (!recipe.name || !recipe.prepTimeMinutes || !recipe.cookTimeMinutes) {
      throw new Error('Missing required fields');
    }

    // Create the recipe
    const createdRecipe = await prisma.recipe.create({
      data: {
        name: recipe.name,
        description: recipe.description || '',
        servings: recipe.servings || 4,
        prepTimeMinutes: recipe.prepTimeMinutes,
        cookTimeMinutes: recipe.cookTimeMinutes,
        totalTimeMinutes: recipe.prepTimeMinutes + recipe.cookTimeMinutes,
        complexity: this.calculateComplexity(recipe),
        costTier: this.calculateCostTier(recipe),
        requiredAppliances: JSON.stringify(recipe.appliances || []),
        goalTags: JSON.stringify(this.inferGoalTags(recipe))
      }
    });

    // Add ingredients
    for (let i = 0; i < recipe.ingredients.length; i++) {
      const ingredient = recipe.ingredients[i];
      await prisma.recipeIngredient.create({
        data: {
          recipeId: createdRecipe.id,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          notes: ingredient.notes
        }
      });
    }

    // Add instructions
    for (let i = 0; i < recipe.instructions.length; i++) {
      await prisma.recipeInstruction.create({
        data: {
          recipeId: createdRecipe.id,
          stepNumber: i + 1,
          instruction: recipe.instructions[i]
        }
      });
    }

    // Add nutritional info if provided
    if (recipe.nutrition) {
      await prisma.nutritionalInfo.create({
        data: {
          recipeId: createdRecipe.id,
          ...recipe.nutrition
        }
      });
    }

    // Add tags
    if (recipe.tags) {
      await this.addTags(createdRecipe.id, recipe.tags);
    }

    return createdRecipe;
  }

  private calculateComplexity(recipe: ImportedRecipe): number {
    // 1-5 scale based on prep time, number of ingredients, and steps
    const timeScore = recipe.prepTimeMinutes > 45 ? 3 : recipe.prepTimeMinutes > 20 ? 2 : 1;
    const ingredientScore = recipe.ingredients.length > 15 ? 2 : 1;
    const stepScore = recipe.instructions.length > 10 ? 2 : 1;
    
    const total = timeScore + ingredientScore + stepScore;
    return Math.min(5, Math.max(1, Math.round(total * 0.8)));
  }

  private calculateCostTier(recipe: ImportedRecipe): string {
    // Analyze ingredients for cost indicators
    const expensiveIngredients = ['salmon', 'steak', 'shrimp', 'lobster', 'truffle', 'saffron'];
    const budgetIngredients = ['beans', 'rice', 'pasta', 'potatoes', 'eggs', 'chicken thighs'];
    
    const ingredients = recipe.ingredients.map(i => i.name.toLowerCase());
    
    const hasExpensive = ingredients.some(ing => 
      expensiveIngredients.some(exp => ing.includes(exp))
    );
    
    const hasBudget = ingredients.some(ing => 
      budgetIngredients.some(budget => ing.includes(budget))
    );
    
    if (hasExpensive) return 'premium';
    if (hasBudget) return 'budget';
    return 'moderate';
  }

  private inferGoalTags(recipe: ImportedRecipe): string[] {
    const tags: string[] = [];
    const name = recipe.name.toLowerCase();
    const desc = (recipe.description || '').toLowerCase();
    
    // Health goals
    if (name.includes('low calorie') || desc.includes('weight loss')) {
      tags.push('weight_loss');
    }
    if (name.includes('high protein') || desc.includes('muscle')) {
      tags.push('muscle_gain');
    }
    if (name.includes('diabetic') || desc.includes('blood sugar')) {
      tags.push('diabetes_management');
    }
    
    // Quick meals
    const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
    if (totalTime <= 20) {
      tags.push('quick_meal');
    }
    
    // Meal prep
    if (desc.includes('meal prep') || desc.includes('batch')) {
      tags.push('meal_prep');
    }
    
    return tags;
  }

  private async addTags(recipeId: string, tags: ImportedRecipe['tags']) {
    if (!tags) return;

    // Add medical tags
    if (tags.medical) {
      for (const tagName of tags.medical) {
        const tag = await prisma.medicalTag.findFirst({
          where: { name: { contains: tagName } }
        });
        if (tag) {
          await prisma.recipeMedicalTag.create({
            data: { recipeId, medicalTagId: tag.id }
          });
        }
      }
    }

    // Add dietary tags
    if (tags.dietary) {
      for (const tagName of tags.dietary) {
        const tag = await prisma.dietaryTag.findFirst({
          where: { name: { contains: tagName } }
        });
        if (tag) {
          await prisma.recipeDietaryTag.create({
            data: { recipeId, dietaryTagId: tag.id }
          });
        }
      }
    }

    // Similar for practical and nutritional tags...
  }

  // Utility method to import from JSON file
  async importFromJSON(jsonData: string): Promise<any> {
    try {
      const recipes = JSON.parse(jsonData) as ImportedRecipe[];
      return this.importRecipes(recipes);
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error}`);
    }
  }

  // Generate sample recipes for testing
  generateSampleRecipes(): ImportedRecipe[] {
    return [
      {
        name: "15-Minute Air Fryer Chicken & Vegetables",
        description: "Quick, healthy dinner perfect for busy weeknights",
        prepTimeMinutes: 5,
        cookTimeMinutes: 10,
        servings: 2,
        ingredients: [
          { name: "Chicken breast", amount: 2, unit: "pieces" },
          { name: "Broccoli florets", amount: 2, unit: "cups" },
          { name: "Bell pepper", amount: 1, unit: "medium" },
          { name: "Olive oil", amount: 1, unit: "tbsp" },
          { name: "Garlic powder", amount: 1, unit: "tsp" },
          { name: "Salt and pepper", amount: 1, unit: "to taste" }
        ],
        instructions: [
          "Preheat air fryer to 400°F (200°C)",
          "Cut chicken into bite-sized pieces",
          "Toss chicken and vegetables with oil and seasonings",
          "Air fry for 10 minutes, shaking basket halfway through",
          "Check chicken is cooked through (165°F internal temp)"
        ],
        appliances: ["air_fryer"],
        tags: {
          medical: ["Heart-Healthy", "Diabetes-Friendly"],
          dietary: ["Gluten-Free", "Dairy-Free"],
          practical: ["Quick-Cook", "One-Pot"],
          nutritional: ["High-Protein", "Low-Calorie"]
        },
        nutrition: {
          calories: 320,
          protein: 35,
          carbohydrates: 15,
          fat: 12,
          fiber: 5,
          sodium: 380
        }
      },
      {
        name: "Microwave Mug Omelette",
        description: "Perfect single-serving breakfast in under 3 minutes",
        prepTimeMinutes: 2,
        cookTimeMinutes: 1,
        servings: 1,
        ingredients: [
          { name: "Eggs", amount: 2, unit: "large" },
          { name: "Milk", amount: 2, unit: "tbsp" },
          { name: "Shredded cheese", amount: 2, unit: "tbsp" },
          { name: "Diced vegetables", amount: 0.25, unit: "cup", notes: "bell peppers, onions, spinach" },
          { name: "Salt and pepper", amount: 1, unit: "pinch" }
        ],
        instructions: [
          "Spray a microwave-safe mug with cooking spray",
          "Beat eggs and milk in the mug",
          "Add vegetables and half the cheese",
          "Microwave for 45 seconds, stir, then microwave 30 more seconds",
          "Top with remaining cheese and enjoy"
        ],
        appliances: ["microwave"],
        tags: {
          medical: ["IBS-Friendly"],
          dietary: ["Vegetarian", "Gluten-Free"],
          practical: ["Quick-Prep", "No-Cook", "Budget-Friendly"],
          nutritional: ["High-Protein"]
        },
        nutrition: {
          calories: 220,
          protein: 18,
          carbohydrates: 5,
          fat: 14,
          fiber: 1,
          sodium: 320
        }
      },
      {
        name: "Instant Pot Lentil Curry",
        description: "Hearty, budget-friendly meal with anti-inflammatory spices",
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        servings: 6,
        ingredients: [
          { name: "Red lentils", amount: 1.5, unit: "cups" },
          { name: "Coconut milk", amount: 1, unit: "can (14oz)" },
          { name: "Diced tomatoes", amount: 1, unit: "can (14oz)" },
          { name: "Onion", amount: 1, unit: "medium" },
          { name: "Garlic", amount: 3, unit: "cloves" },
          { name: "Fresh ginger", amount: 1, unit: "tbsp" },
          { name: "Curry powder", amount: 2, unit: "tbsp" },
          { name: "Turmeric", amount: 1, unit: "tsp" },
          { name: "Vegetable broth", amount: 2, unit: "cups" }
        ],
        instructions: [
          "Set Instant Pot to sauté mode",
          "Sauté onion, garlic, and ginger for 2 minutes",
          "Add spices and cook 30 seconds until fragrant",
          "Add lentils, tomatoes, coconut milk, and broth",
          "Pressure cook on high for 10 minutes",
          "Natural release for 5 minutes, then quick release"
        ],
        appliances: ["instant_pot"],
        tags: {
          medical: ["Anti-Inflammatory", "Heart-Healthy"],
          dietary: ["Vegan", "Gluten-Free"],
          practical: ["Batch-Cookable", "Freezer-Friendly", "Budget-Friendly"],
          nutritional: ["High-Fiber", "High-Protein"]
        },
        nutrition: {
          calories: 285,
          protein: 14,
          carbohydrates: 38,
          fat: 9,
          fiber: 12,
          sodium: 420
        }
      }
    ];
  }
} 