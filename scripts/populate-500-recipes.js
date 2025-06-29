// Populate Recipe Bank with 500 Optimally Distributed Recipes
const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

// Recipe generation templates
const recipeTemplates = {
  // Breakfast templates
  breakfast: {
    names: ['Overnight Oats', 'Scrambled Eggs', 'Smoothie Bowl', 'Avocado Toast', 'Greek Yogurt Parfait', 'Protein Pancakes', 'Breakfast Burrito', 'Chia Pudding', 'French Toast', 'Egg Muffins'],
    proteins: ['eggs', 'greek yogurt', 'protein powder', 'cottage cheese', 'tofu', 'turkey bacon'],
    carbs: ['oats', 'whole wheat bread', 'quinoa', 'sweet potato', 'banana', 'berries'],
    appliances: ['stovetop', 'microwave', 'blender', 'toaster', 'oven']
  },
  
  // Lunch templates
  lunch: {
    names: ['Buddha Bowl', 'Chicken Salad', 'Quinoa Bowl', 'Wrap', 'Soup', 'Sandwich', 'Poke Bowl', 'Grain Bowl', 'Power Salad', 'Stuffed Sweet Potato'],
    proteins: ['chicken breast', 'chickpeas', 'salmon', 'tofu', 'black beans', 'tuna', 'turkey'],
    carbs: ['quinoa', 'brown rice', 'sweet potato', 'whole wheat wrap', 'farro', 'couscous'],
    appliances: ['stovetop', 'oven', 'air fryer', 'instant pot', 'microwave']
  },
  
  // Dinner templates
  dinner: {
    names: ['Stir Fry', 'Curry', 'Roasted Chicken', 'Pasta', 'Buddha Bowl', 'Tacos', 'Salmon', 'Chili', 'Casserole', 'Sheet Pan Dinner'],
    proteins: ['chicken', 'beef', 'salmon', 'shrimp', 'tofu', 'lentils', 'beans'],
    carbs: ['rice', 'pasta', 'potatoes', 'quinoa', 'noodles', 'tortillas'],
    appliances: ['stovetop', 'oven', 'air fryer', 'instant pot', 'slow cooker']
  },
  
  // Snack templates
  snack: {
    names: ['Energy Balls', 'Hummus & Veggies', 'Trail Mix', 'Protein Bar', 'Smoothie', 'Rice Cakes', 'Fruit & Nut Butter', 'Popcorn', 'Veggie Chips', 'Protein Shake'],
    proteins: ['nut butter', 'protein powder', 'nuts', 'seeds', 'greek yogurt', 'hummus'],
    carbs: ['dates', 'oats', 'rice cakes', 'fruit', 'vegetables', 'whole grain crackers'],
    appliances: ['none', 'blender', 'food processor', 'air fryer', 'microwave']
  },
  
  // Dessert templates
  dessert: {
    names: ['Protein Cookies', 'Frozen Yogurt Bark', 'Chia Mousse', 'Fruit Crumble', 'Energy Bites', 'Nice Cream', 'Baked Apples', 'Chocolate Avocado Mousse'],
    proteins: ['protein powder', 'greek yogurt', 'almond flour', 'chia seeds'],
    carbs: ['oats', 'dates', 'banana', 'berries', 'dark chocolate'],
    appliances: ['oven', 'freezer', 'blender', 'food processor', 'microwave']
  }
};

// Appliance mappings
const applianceMap = {
  "Overnight Oats": ["no_cook"],
  "Smoothie": ["blender"],
  "Microwave": ["microwave"],
  "Sheet Pan": ["oven"],
  "Stir Fry": ["stovetop"],
  "Slow Cooker": ["slow_cooker"],
  "Air Fryer": ["air_fryer"],
  "Instant Pot": ["instant_pot"],
  "Grilled": ["grill", "stovetop"],
  "Baked": ["oven"],
  "No-Bake": ["no_cook"]
};

// Time mappings
const timeMap = {
  quick: { prep: 5, cook: 10, total: 15 },
  moderate: { prep: 15, cook: 25, total: 40 },
  long: { prep: 20, cook: 40, total: 60 }
};

// Nutrition profiles
const nutritionProfiles = {
  highProtein: { calories: 350, protein: 30, carbs: 25, fat: 12, fiber: 5 },
  balanced: { calories: 400, protein: 20, carbs: 45, fat: 15, fiber: 7 },
  lowCarb: { calories: 300, protein: 25, carbs: 15, fat: 18, fiber: 8 },
  vegan: { calories: 380, protein: 15, carbs: 50, fat: 14, fiber: 10 },
  energyBoost: { calories: 450, protein: 18, carbs: 60, fat: 16, fiber: 6 }
};

// Generate recipe with intelligent properties
function generateRecipe(mealType, template, variation, index) {
  const baseName = `${variation} ${template.base}`;
  const isQuick = template.base.includes("Quick") || mealType === "snack";
  const timing = isQuick ? timeMap.quick : timeMap.moderate;
  
  // Determine appliances
  let appliances = ["stovetop"]; // default
  Object.entries(applianceMap).forEach(([key, value]) => {
    if (template.base.includes(key)) {
      appliances = value;
    }
  });
  
  // Vary appliances based on index for diversity
  if (index % 5 === 0 && !appliances.includes("no_cook")) appliances = ["air_fryer"];
  if (index % 7 === 0 && !appliances.includes("no_cook")) appliances = ["instant_pot"];
  if (index % 11 === 0) appliances = ["microwave"];
  
  // Determine dietary pattern
  let dietaryPattern = "standard";
  if (variation.includes("Tofu") || variation.includes("Tempeh")) dietaryPattern = "vegan";
  else if (variation.includes("Veggie") || variation.includes("Bean")) dietaryPattern = "vegetarian";
  else if (template.base.includes("Keto")) dietaryPattern = "keto";
  
  // Determine health goal
  const healthGoals = ["weight_loss", "muscle_gain", "heart_health", "energy_boost", "general_health"];
  const primaryGoal = healthGoals[index % healthGoals.length];
  
  // Select nutrition profile
  let nutritionProfile = nutritionProfiles.balanced;
  if (primaryGoal === "muscle_gain") nutritionProfile = nutritionProfiles.highProtein;
  else if (primaryGoal === "weight_loss") nutritionProfile = nutritionProfiles.lowCarb;
  else if (dietaryPattern === "vegan") nutritionProfile = nutritionProfiles.vegan;
  
  // Generate ingredients based on template
  const ingredients = generateIngredients(template.base, variation, dietaryPattern);
  
  // Generate instructions
  const instructions = generateInstructions(template.base, timing.cook, appliances[0]);
  
  return {
    name: baseName,
    description: `Delicious ${baseName.toLowerCase()} perfect for ${mealType}`,
    prepTimeMinutes: timing.prep,
    cookTimeMinutes: timing.cook,
    totalTimeMinutes: timing.total,
    servings: mealType === "snack" ? 2 : 4,
    complexity: isQuick ? 2 : 3,
    costTier: index % 3 === 0 ? "premium" : index % 2 === 0 ? "moderate" : "budget",
    requiredAppliances: JSON.stringify(appliances),
    goalTags: JSON.stringify([primaryGoal, dietaryPattern, mealType]),
    nutrition: {
      calories: nutritionProfile.calories + (Math.random() * 100 - 50),
      protein: nutritionProfile.protein + (Math.random() * 10 - 5),
      carbohydrates: nutritionProfile.carbs + (Math.random() * 10 - 5),
      fat: nutritionProfile.fat + (Math.random() * 5 - 2.5),
      fiber: nutritionProfile.fiber + (Math.random() * 3 - 1.5),
      sodium: 300 + Math.random() * 200
    },
    ingredients,
    instructions
  };
}

// Generate ingredients based on recipe type
function generateIngredients(base, variation, dietaryPattern) {
  const commonIngredients = {
    "Overnight Oats": [
      { name: "rolled oats", amount: 0.5, unit: "cup" },
      { name: "milk", amount: 0.5, unit: "cup" },
      { name: "chia seeds", amount: 1, unit: "tbsp" }
    ],
    "Smoothie": [
      { name: "frozen fruit", amount: 1, unit: "cup" },
      { name: "spinach", amount: 1, unit: "handful" },
      { name: "protein powder", amount: 1, unit: "scoop" }
    ],
    "Sheet Pan": [
      { name: "protein", amount: 1, unit: "lb" },
      { name: "vegetables", amount: 2, unit: "cups" },
      { name: "olive oil", amount: 2, unit: "tbsp" }
    ],
    "Stir Fry": [
      { name: "protein", amount: 1, unit: "lb" },
      { name: "mixed vegetables", amount: 3, unit: "cups" },
      { name: "sauce", amount: 0.5, unit: "cup" }
    ]
  };
  
  // Get base ingredients
  let ingredients = [];
  Object.keys(commonIngredients).forEach(key => {
    if (base.includes(key)) {
      ingredients = [...commonIngredients[key]];
    }
  });
  
  // If no match, create generic ingredients
  if (ingredients.length === 0) {
    ingredients = [
      { name: "main ingredient", amount: 1, unit: "cup" },
      { name: "seasoning", amount: 1, unit: "tsp" },
      { name: "oil", amount: 1, unit: "tbsp" }
    ];
  }
  
  // Customize for variation
  if (variation.includes("Chocolate")) {
    ingredients.push({ name: "cocoa powder", amount: 1, unit: "tbsp" });
  }
  if (variation.includes("Berry")) {
    ingredients.push({ name: "mixed berries", amount: 0.5, unit: "cup" });
  }
  
  // Adjust for dietary pattern
  if (dietaryPattern === "vegan") {
    ingredients = ingredients.map(ing => {
      if (ing.name === "milk") return { ...ing, name: "plant milk" };
      if (ing.name === "protein") return { ...ing, name: "tofu" };
      return ing;
    });
  }
  
  return ingredients;
}

// Generate instructions based on recipe type
function generateInstructions(base, cookTime, appliance) {
  const templates = {
    "no_cook": [
      "Combine all ingredients in a bowl",
      "Mix well until combined",
      "Refrigerate for best results",
      "Serve chilled"
    ],
    "microwave": [
      "Add ingredients to microwave-safe dish",
      `Microwave on high for ${Math.floor(cookTime/2)} minutes`,
      "Stir halfway through",
      `Continue cooking for ${Math.floor(cookTime/2)} minutes`,
      "Let stand 1 minute before serving"
    ],
    "air_fryer": [
      "Preheat air fryer to 375°F",
      "Prepare ingredients and season",
      `Air fry for ${cookTime} minutes`,
      "Shake basket halfway through",
      "Serve immediately"
    ],
    "instant_pot": [
      "Add ingredients to Instant Pot",
      "Secure lid and set to sealing",
      `Pressure cook on high for ${cookTime} minutes`,
      "Natural release for 10 minutes",
      "Quick release remaining pressure"
    ],
    "stovetop": [
      "Heat oil in a large pan",
      "Add ingredients and seasonings",
      `Cook for ${cookTime} minutes, stirring occasionally`,
      "Adjust seasoning to taste",
      "Serve hot"
    ],
    "oven": [
      "Preheat oven to 400°F",
      "Arrange ingredients on baking sheet",
      "Drizzle with oil and season",
      `Bake for ${cookTime} minutes`,
      "Serve immediately"
    ]
  };
  
  return templates[appliance] || templates.stovetop;
}

// Main function to populate database
async function populate500Recipes() {
  console.log('🚀 Starting to populate 500 recipes...\n');
  
  try {
    let totalCreated = 0;
    const targetCounts = {
      breakfast: 100,
      lunch: 125,
      dinner: 175,
      snack: 75,
      dessert: 25
    };
    
    for (const [mealType, targetCount] of Object.entries(targetCounts)) {
      console.log(`\n📍 Creating ${targetCount} ${mealType} recipes...`);
      let mealTypeCount = 0;
      
      const templates = recipeTemplates[mealType];
      const categories = Object.keys(templates);
      
      for (const category of categories) {
        const categoryTemplates = templates[category];
        
        for (const template of categoryTemplates) {
          for (const variation of template.variations) {
            if (mealTypeCount >= targetCount) break;
            
            const recipe = generateRecipe(mealType, template, variation, totalCreated);
            
            try {
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
                  ingredients: {
                    create: recipe.ingredients.map((ing, idx) => ({
                      name: ing.name,
                      amount: ing.amount,
                      unit: ing.unit,
                    }))
                  },
                  instructions: {
                    create: recipe.instructions.map((instruction, idx) => ({
                      stepNumber: idx + 1,
                      instruction: instruction
                    }))
                  },
                  nutritionalInfo: {
                    create: {
                      calories: Math.round(recipe.nutrition.calories),
                      protein: Math.round(recipe.nutrition.protein),
                      carbohydrates: Math.round(recipe.nutrition.carbohydrates),
                      fat: Math.round(recipe.nutrition.fat),
                      fiber: Math.round(recipe.nutrition.fiber),
                      sodium: Math.round(recipe.nutrition.sodium)
                    }
                  }
                }
              });
              
              mealTypeCount++;
              totalCreated++;
              
              if (totalCreated % 10 === 0) {
                console.log(`  ✅ Created ${totalCreated} recipes so far...`);
              }
            } catch (error) {
              console.error(`  ❌ Error creating ${recipe.name}:`, error.message);
            }
          }
        }
      }
      
      console.log(`  ✅ Completed ${mealTypeCount} ${mealType} recipes`);
    }
    
    const finalCount = await prisma.recipe.count();
    console.log(`\n✨ Success! Total recipes in database: ${finalCount}`);
    
    // Show distribution stats
    console.log('\n📊 Recipe Distribution:');
    const stats = await prisma.$queryRaw`
      SELECT 
        JSON_EXTRACT(goalTags, '$[2]') as meal_type,
        COUNT(*) as count
      FROM recipes
      GROUP BY meal_type
    `;
    console.log(stats);
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the population script
populate500Recipes(); 