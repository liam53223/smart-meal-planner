// Simple Recipe Loader - JavaScript version
const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function loadSampleRecipes() {
  console.log('🍳 Loading sample recipes into database...');
  
  try {
    // Sample recipes based on the intelligent algorithm
    const recipes = [
      // Quick & Healthy Air Fryer Recipes
      {
        name: "Crispy Air Fryer Chicken Breast",
        description: "Juicy inside, crispy outside - perfect for meal prep",
        ingredients: JSON.stringify([
          { name: "chicken breast", amount: 2, unit: "pieces" },
          { name: "olive oil", amount: 1, unit: "tbsp" },
          { name: "garlic powder", amount: 1, unit: "tsp" },
          { name: "paprika", amount: 1, unit: "tsp" },
          { name: "salt", amount: 0.5, unit: "tsp" }
        ]),
        instructions: JSON.stringify([
          "Pat chicken dry and brush with olive oil",
          "Mix spices and coat chicken evenly",
          "Air fry at 375°F for 18-20 minutes, flipping halfway",
          "Rest for 5 minutes before serving"
        ]),
        prepTimeMinutes: 5,
        cookTimeMinutes: 20,
        totalTimeMinutes: 25,
        servings: 2,
        difficulty: "Easy",
        complexity: 2,
        costTier: "budget",
        requiredAppliances: JSON.stringify(["air fryer"]),
        goalTags: JSON.stringify(["weight_loss", "high_protein", "quick"]),
        tags: JSON.stringify(["air fryer", "chicken", "healthy", "protein"])
      },
      
      // Microwave Quick Meals
      {
        name: "5-Minute Microwave Veggie Omelet",
        description: "Quick protein-packed breakfast in a mug",
        ingredients: JSON.stringify([
          { name: "eggs", amount: 2, unit: "whole" },
          { name: "milk", amount: 2, unit: "tbsp" },
          { name: "mixed vegetables", amount: 0.5, unit: "cup" },
          { name: "cheese", amount: 2, unit: "tbsp" },
          { name: "salt", amount: 0.25, unit: "tsp" }
        ]),
        instructions: JSON.stringify([
          "Whisk eggs and milk in a microwave-safe mug",
          "Add vegetables and salt",
          "Microwave for 1 minute, stir, then 30 more seconds",
          "Top with cheese and microwave 15 seconds to melt"
        ]),
        prepTimeMinutes: 2,
        cookTimeMinutes: 3,
        totalTimeMinutes: 5,
        servings: 1,
        difficulty: "Easy",
        complexity: 1,
        costTier: "budget",
        requiredAppliances: JSON.stringify(["microwave"]),
        goalTags: JSON.stringify(["quick", "vegetarian", "high_protein"]),
        tags: JSON.stringify(["microwave", "breakfast", "eggs", "vegetarian"])
      },
      
      // Instant Pot Batch Cooking
      {
        name: "Instant Pot Turmeric Lentil Curry",
        description: "Anti-inflammatory powerhouse perfect for meal prep",
        ingredients: JSON.stringify([
          { name: "red lentils", amount: 1, unit: "cup" },
          { name: "coconut milk", amount: 1, unit: "can" },
          { name: "turmeric", amount: 2, unit: "tsp" },
          { name: "ginger", amount: 1, unit: "tbsp" },
          { name: "garlic", amount: 3, unit: "cloves" },
          { name: "spinach", amount: 2, unit: "cups" },
          { name: "vegetable broth", amount: 2, unit: "cups" }
        ]),
        instructions: JSON.stringify([
          "Sauté ginger and garlic in Instant Pot for 2 minutes",
          "Add lentils, turmeric, and broth",
          "Pressure cook on high for 10 minutes, natural release",
          "Stir in coconut milk and spinach until wilted"
        ]),
        prepTimeMinutes: 10,
        cookTimeMinutes: 20,
        totalTimeMinutes: 30,
        servings: 6,
        difficulty: "Easy",
        complexity: 2,
        costTier: "budget",
        requiredAppliances: JSON.stringify(["instant pot"]),
        goalTags: JSON.stringify(["anti_inflammatory", "vegan", "meal_prep"]),
        tags: JSON.stringify(["instant pot", "curry", "lentils", "healthy"])
      },
      
      // Traditional Healthy
      {
        name: "Sheet Pan Mediterranean Salmon",
        description: "Heart-healthy omega-3 rich dinner with minimal cleanup",
        ingredients: JSON.stringify([
          { name: "salmon fillets", amount: 4, unit: "pieces" },
          { name: "cherry tomatoes", amount: 2, unit: "cups" },
          { name: "bell peppers", amount: 2, unit: "whole" },
          { name: "red onion", amount: 1, unit: "whole" },
          { name: "olive oil", amount: 3, unit: "tbsp" },
          { name: "lemon", amount: 1, unit: "whole" },
          { name: "oregano", amount: 1, unit: "tsp" }
        ]),
        instructions: JSON.stringify([
          "Preheat oven to 425°F",
          "Chop vegetables and toss with 2 tbsp olive oil",
          "Arrange on sheet pan and roast 15 minutes",
          "Add salmon, drizzle with oil and lemon",
          "Roast additional 12-15 minutes until salmon flakes"
        ]),
        prepTimeMinutes: 10,
        cookTimeMinutes: 30,
        totalTimeMinutes: 40,
        servings: 4,
        difficulty: "Medium",
        complexity: 3,
        costTier: "moderate",
        requiredAppliances: JSON.stringify(["oven"]),
        goalTags: JSON.stringify(["heart_health", "omega_3", "mediterranean"]),
        tags: JSON.stringify(["salmon", "sheet pan", "healthy", "dinner"])
      },
      
      // Quick Stovetop
      {
        name: "15-Minute Chickpea Tikka Masala",
        description: "Plant-based protein with anti-inflammatory spices",
        ingredients: JSON.stringify([
          { name: "canned chickpeas", amount: 2, unit: "cans" },
          { name: "tikka masala sauce", amount: 1, unit: "jar" },
          { name: "spinach", amount: 3, unit: "cups" },
          { name: "coconut milk", amount: 0.5, unit: "cup" },
          { name: "garam masala", amount: 1, unit: "tsp" },
          { name: "cilantro", amount: 0.25, unit: "cup" }
        ]),
        instructions: JSON.stringify([
          "Heat tikka masala sauce in large pan",
          "Add drained chickpeas and garam masala",
          "Simmer 10 minutes, stirring occasionally",
          "Add spinach and coconut milk, cook until wilted",
          "Garnish with cilantro and serve"
        ]),
        prepTimeMinutes: 5,
        cookTimeMinutes: 10,
        totalTimeMinutes: 15,
        servings: 4,
        difficulty: "Easy",
        complexity: 2,
        costTier: "budget",
        requiredAppliances: JSON.stringify(["stovetop"]),
        goalTags: JSON.stringify(["vegetarian", "quick", "high_fiber"]),
        tags: JSON.stringify(["indian", "chickpeas", "vegetarian", "quick"])
      }
    ];

    // Create nutritional info for each recipe
    const nutritionData = [
      { calories: 320, protein: 45, carbohydrates: 8, fat: 12, fiber: 0, sodium: 400 },
      { calories: 180, protein: 12, carbohydrates: 8, fat: 10, fiber: 2, sodium: 300 },
      { calories: 280, protein: 18, carbohydrates: 42, fat: 8, fiber: 12, sodium: 350 },
      { calories: 380, protein: 32, carbohydrates: 18, fat: 22, fiber: 4, sodium: 420 },
      { calories: 260, protein: 12, carbohydrates: 38, fat: 9, fiber: 10, sodium: 480 }
    ];

          // Load recipes with nutritional info
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      const nutrition = nutritionData[i];
      
      console.log(`Loading recipe: ${recipe.name}`);
      
      // Parse the JSON strings back to arrays
      const ingredientsData = JSON.parse(recipe.ingredients);
      const instructionsData = JSON.parse(recipe.instructions);
      
      const createdRecipe = await prisma.recipe.create({
                  data: {
          name: recipe.name,
          description: recipe.description,
          prepTimeMinutes: recipe.prepTimeMinutes,
          cookTimeMinutes: recipe.cookTimeMinutes,
          totalTimeMinutes: recipe.totalTimeMinutes,
          servings: recipe.servings,
          complexity: recipe.complexity,
          costTier: recipe.costTier,
          requiredAppliances: recipe.requiredAppliances,
          goalTags: recipe.goalTags,
          // Create ingredients as related records
          ingredients: {
            create: ingredientsData.map(ing => ({
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit
            }))
          },
          // Create instructions as related records
          instructions: {
            create: instructionsData.map((instruction, index) => ({
              stepNumber: index + 1,
              instruction: instruction
            }))
          },
          // Create nutritional info
          nutritionalInfo: {
            create: {
              calories: nutrition.calories,
              protein: nutrition.protein,
              carbohydrates: nutrition.carbohydrates,
              fat: nutrition.fat,
              fiber: nutrition.fiber,
              sodium: nutrition.sodium
            }
          }
        }
      });
      
      console.log(`✅ Created: ${createdRecipe.name}`);
    }

    const count = await prisma.recipe.count();
    console.log(`\n✨ Success! Total recipes in database: ${count}`);
    
  } catch (error) {
    console.error('❌ Error loading recipes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the loader
loadSampleRecipes(); 