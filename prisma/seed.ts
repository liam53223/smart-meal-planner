import { PrismaClient } from '../src/generated/prisma';
import { seedAppliances } from './seed-appliances';
import { seedSpiceBlends } from './seed-spice-blends';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await clearDatabase();

  // Seed core data
  await seedHealthConditions();
  await seedAllergens();
  await seedTags();
  await seedAppliances();
  await seedSpiceBlends();
  await seedSampleRecipes();
  await seedSampleUsers();

  console.log('✅ Database seeding completed!');
}

async function clearDatabase() {
  console.log('🧹 Clearing existing data...');
  
  // Clear in correct order to avoid foreign key constraints
  await prisma.userFavoriteRecipe.deleteMany();
  await prisma.mealPlanItem.deleteMany();
  await prisma.shoppingListItem.deleteMany();
  await prisma.shoppingList.deleteMany();
  await prisma.mealPlan.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.recipeSpiceBlend.deleteMany();
  await prisma.recipeNutritionalTag.deleteMany();
  await prisma.recipePracticalTag.deleteMany();
  await prisma.recipeDietaryTag.deleteMany();
  await prisma.recipeMedicalTag.deleteMany();
  await prisma.nutritionalInfo.deleteMany();
  await prisma.recipeInstruction.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.nutritionalTag.deleteMany();
  await prisma.practicalTag.deleteMany();
  await prisma.dietaryTag.deleteMany();
  await prisma.medicalTag.deleteMany();
  await prisma.userBehavior.deleteMany();
  await prisma.userAppliance.deleteMany();
  await prisma.userAllergy.deleteMany();
  await prisma.userHealthCondition.deleteMany();
  await prisma.userPreferences.deleteMany();
  await prisma.user.deleteMany();
  await prisma.spiceBlend.deleteMany();
  await prisma.appliance.deleteMany();
  await prisma.allergen.deleteMany();
  await prisma.healthCondition.deleteMany();
}

async function seedHealthConditions() {
  console.log('🏥 Seeding health conditions...');

  const healthConditions = [
    // Digestive Conditions
    { name: 'IBS (Irritable Bowel Syndrome)', description: 'Chronic gastrointestinal disorder', category: 'DIGESTIVE' },
    { name: 'Crohns Disease', description: 'Inflammatory bowel disease', category: 'DIGESTIVE' },
    { name: 'Ulcerative Colitis', description: 'Inflammatory bowel disease affecting colon', category: 'DIGESTIVE' },
    { name: 'Celiac Disease', description: 'Autoimmune disorder triggered by gluten', category: 'DIGESTIVE' },
    { name: 'GERD', description: 'Gastroesophageal reflux disease', category: 'DIGESTIVE' },
    { name: 'Gastroparesis', description: 'Delayed stomach emptying', category: 'DIGESTIVE' },
    
    // Metabolic Conditions
    { name: 'Type 1 Diabetes', description: 'Autoimmune diabetes requiring insulin', category: 'METABOLIC' },
    { name: 'Type 2 Diabetes', description: 'Insulin resistance diabetes', category: 'METABOLIC' },
    { name: 'Prediabetes', description: 'Elevated blood sugar levels', category: 'METABOLIC' },
    { name: 'Metabolic Syndrome', description: 'Cluster of metabolic risk factors', category: 'METABOLIC' },
    { name: 'Insulin Resistance', description: 'Reduced insulin sensitivity', category: 'METABOLIC' },
    
    // Autoimmune Conditions
    { name: 'Rheumatoid Arthritis', description: 'Autoimmune joint inflammation', category: 'AUTOIMMUNE' },
    { name: 'Lupus', description: 'Systemic autoimmune disease', category: 'AUTOIMMUNE' },
    { name: 'Multiple Sclerosis', description: 'Autoimmune neurological condition', category: 'AUTOIMMUNE' },
    { name: 'Hashimotos Thyroiditis', description: 'Autoimmune thyroid condition', category: 'AUTOIMMUNE' },
    { name: 'Psoriasis', description: 'Autoimmune skin condition', category: 'AUTOIMMUNE' },
    
    // Cardiovascular Conditions
    { name: 'Hypertension', description: 'High blood pressure', category: 'CARDIOVASCULAR' },
    { name: 'Heart Disease', description: 'Cardiovascular disease', category: 'CARDIOVASCULAR' },
    { name: 'High Cholesterol', description: 'Elevated blood cholesterol', category: 'CARDIOVASCULAR' },
    { name: 'Atrial Fibrillation', description: 'Irregular heart rhythm', category: 'CARDIOVASCULAR' },
    
    // Hormonal Conditions
    { name: 'PCOS', description: 'Polycystic ovary syndrome', category: 'HORMONAL' },
    { name: 'Hypothyroidism', description: 'Underactive thyroid', category: 'HORMONAL' },
    { name: 'Hyperthyroidism', description: 'Overactive thyroid', category: 'HORMONAL' },
    { name: 'Adrenal Fatigue', description: 'Chronic stress response dysfunction', category: 'HORMONAL' },
    
    // Kidney Conditions
    { name: 'Chronic Kidney Disease Stage 3', description: 'Moderate kidney function decline', category: 'OTHER' },
    { name: 'Chronic Kidney Disease Stage 4', description: 'Severe kidney function decline', category: 'OTHER' },
    { name: 'Chronic Kidney Disease Stage 5', description: 'Kidney failure', category: 'OTHER' },
    
    // Neurological Conditions
    { name: 'Epilepsy', description: 'Neurological seizure disorder', category: 'NEUROLOGICAL' },
    { name: 'Migraine', description: 'Chronic headache disorder', category: 'NEUROLOGICAL' },
    { name: 'Parkinsons Disease', description: 'Progressive neurological disorder', category: 'NEUROLOGICAL' }
  ];

  for (const condition of healthConditions) {
    await prisma.healthCondition.create({
      data: condition as any
    });
  }
}

async function seedAllergens() {
  console.log('🚨 Seeding allergens...');

  const allergens = [
    // Food Allergens
    { name: 'Milk/Dairy', description: 'Milk and dairy products', category: 'FOOD' },
    { name: 'Eggs', description: 'Chicken eggs and egg products', category: 'FOOD' },
    { name: 'Peanuts', description: 'Peanuts and peanut products', category: 'FOOD' },
    { name: 'Tree Nuts', description: 'Almonds, walnuts, cashews, etc.', category: 'FOOD' },
    { name: 'Fish', description: 'All fish species', category: 'FOOD' },
    { name: 'Shellfish', description: 'Shrimp, crab, lobster, etc.', category: 'FOOD' },
    { name: 'Wheat/Gluten', description: 'Wheat, barley, rye containing gluten', category: 'FOOD' },
    { name: 'Soy', description: 'Soybeans and soy products', category: 'FOOD' },
    { name: 'Sesame', description: 'Sesame seeds and products', category: 'FOOD' },
    { name: 'Corn', description: 'Corn and corn products', category: 'FOOD' },
    { name: 'Sulfites', description: 'Sulfur dioxide and sulfites', category: 'FOOD' },
    { name: 'Nightshades', description: 'Tomatoes, peppers, potatoes, eggplant', category: 'FOOD' },
    
    // Environmental Allergens
    { name: 'Pollen', description: 'Tree, grass, and weed pollens', category: 'ENVIRONMENTAL' },
    { name: 'Dust Mites', description: 'House dust mites', category: 'ENVIRONMENTAL' },
    { name: 'Mold', description: 'Various mold species', category: 'ENVIRONMENTAL' },
    { name: 'Pet Dander', description: 'Cat and dog dander', category: 'ENVIRONMENTAL' },
    
    // Medication Allergens
    { name: 'Penicillin', description: 'Penicillin antibiotics', category: 'MEDICATION' },
    { name: 'Aspirin', description: 'Aspirin and NSAIDs', category: 'MEDICATION' },
    { name: 'Latex', description: 'Natural rubber latex', category: 'OTHER' }
  ];

  for (const allergen of allergens) {
    await prisma.allergen.create({
      data: allergen as any
    });
  }
}

async function seedTags() {
  console.log('🏷️ Seeding recipe tags...');

  // Medical Tags
  const medicalTags = [
    { name: 'IBS-Friendly', description: 'Suitable for IBS management', condition: 'ibs' },
    { name: 'Low-FODMAP', description: 'Low in fermentable carbohydrates', condition: 'ibs' },
    { name: 'Diabetes-Friendly', description: 'Blood sugar friendly', condition: 'diabetes' },
    { name: 'Low-Glycemic', description: 'Low glycemic index foods', condition: 'diabetes' },
    { name: 'AIP-Compliant', description: 'Autoimmune Protocol compliant', condition: 'autoimmune' },
    { name: 'Anti-Inflammatory', description: 'Contains anti-inflammatory ingredients', condition: 'autoimmune' },
    { name: 'Heart-Healthy', description: 'Supports cardiovascular health', condition: 'heart_disease' },
    { name: 'Low-Sodium', description: 'Less than 600mg sodium per serving', condition: 'heart_disease' },
    { name: 'Kidney-Friendly', description: 'Appropriate for kidney disease', condition: 'kidney_disease' },
    { name: 'Low-Potassium', description: 'Less than 200mg potassium per serving', condition: 'kidney_disease' },
    { name: 'Low-Phosphorus', description: 'Less than 150mg phosphorus per serving', condition: 'kidney_disease' },
    { name: 'PCOS-Friendly', description: 'Supports hormonal balance', condition: 'pcos' },
    { name: 'Thyroid-Supporting', description: 'Supports thyroid function', condition: 'thyroid' },
    { name: 'Gut-Healing', description: 'Supports digestive health', condition: 'digestive' }
  ];

  for (const tag of medicalTags) {
    await prisma.medicalTag.create({ data: tag });
  }

  // Dietary Tags
  const dietaryTags = [
    { name: 'Vegan', description: 'No animal products', category: 'RESTRICTION' },
    { name: 'Vegetarian', description: 'No meat or fish', category: 'RESTRICTION' },
    { name: 'Pescatarian', description: 'Fish allowed, no meat', category: 'RESTRICTION' },
    { name: 'Gluten-Free', description: 'No gluten-containing ingredients', category: 'RESTRICTION' },
    { name: 'Dairy-Free', description: 'No dairy products', category: 'RESTRICTION' },
    { name: 'Egg-Free', description: 'No eggs', category: 'RESTRICTION' },
    { name: 'Nut-Free', description: 'No tree nuts or peanuts', category: 'RESTRICTION' },
    { name: 'Soy-Free', description: 'No soy products', category: 'RESTRICTION' },
    { name: 'Keto', description: 'Very low carb, high fat', category: 'LIFESTYLE' },
    { name: 'Paleo', description: 'Paleolithic diet principles', category: 'LIFESTYLE' },
    { name: 'Whole30', description: 'Whole30 program compliant', category: 'LIFESTYLE' },
    { name: 'Mediterranean', description: 'Mediterranean diet style', category: 'LIFESTYLE' },
    { name: 'DASH', description: 'DASH diet principles', category: 'LIFESTYLE' },
    { name: 'Halal', description: 'Islamic dietary laws', category: 'RELIGIOUS' },
    { name: 'Kosher', description: 'Jewish dietary laws', category: 'RELIGIOUS' }
  ];

  for (const tag of dietaryTags) {
    await prisma.dietaryTag.create({ data: tag as any });
  }

  // Practical Tags
  const practicalTags = [
    { name: 'Quick-Prep', description: 'Under 15 minutes prep time', category: 'TIME' },
    { name: 'Quick-Cook', description: 'Under 30 minutes total time', category: 'TIME' },
    { name: 'One-Pot', description: 'Single pot or pan cooking', category: 'EQUIPMENT' },
    { name: 'Slow-Cooker', description: 'Slow cooker recipe', category: 'EQUIPMENT' },
    { name: 'Instant-Pot', description: 'Pressure cooker recipe', category: 'EQUIPMENT' },
    { name: 'No-Cook', description: 'No cooking required', category: 'TIME' },
    { name: 'Beginner-Friendly', description: 'Easy for cooking beginners', category: 'SKILL' },
    { name: 'Batch-Cookable', description: 'Good for meal prep', category: 'BATCH_COOKING' },
    { name: 'Freezer-Friendly', description: 'Can be frozen', category: 'BATCH_COOKING' },
    { name: 'Budget-Friendly', description: 'Affordable ingredients', category: 'TIME' },
    { name: 'Kid-Friendly', description: 'Appeals to children', category: 'SKILL' },
    { name: 'Portable', description: 'Easy to transport', category: 'SKILL' }
  ];

  for (const tag of practicalTags) {
    await prisma.practicalTag.create({ data: tag as any });
  }

  // Nutritional Tags
  const nutritionalTags = [
    { name: 'High-Protein', description: 'Over 20g protein per serving', category: 'MACRONUTRIENT' },
    { name: 'Low-Carb', description: 'Under 20g carbs per serving', category: 'MACRONUTRIENT' },
    { name: 'High-Fiber', description: 'Over 5g fiber per serving', category: 'MACRONUTRIENT' },
    { name: 'Healthy-Fats', description: 'Rich in omega-3 or monounsaturated fats', category: 'MACRONUTRIENT' },
    { name: 'Low-Calorie', description: 'Under 300 calories per serving', category: 'MACRONUTRIENT' },
    { name: 'Vitamin-C-Rich', description: 'High in vitamin C', category: 'MICRONUTRIENT' },
    { name: 'Iron-Rich', description: 'Good source of iron', category: 'MICRONUTRIENT' },
    { name: 'Calcium-Rich', description: 'High in calcium', category: 'MICRONUTRIENT' },
    { name: 'Omega-3-Rich', description: 'High in omega-3 fatty acids', category: 'SPECIAL_FOCUS' },
    { name: 'Antioxidant-Rich', description: 'High in antioxidants', category: 'SPECIAL_FOCUS' },
    { name: 'Probiotic', description: 'Contains beneficial bacteria', category: 'SPECIAL_FOCUS' },
    { name: 'Prebiotic', description: 'Feeds beneficial gut bacteria', category: 'SPECIAL_FOCUS' }
  ];

  for (const tag of nutritionalTags) {
    await prisma.nutritionalTag.create({ data: tag as any });
  }
}

async function seedSampleRecipes() {
  console.log('🍳 Seeding sample recipes...');

  // Get tag IDs for relationships
  const medicalTags = await prisma.medicalTag.findMany();
  const dietaryTags = await prisma.dietaryTag.findMany();
  const practicalTags = await prisma.practicalTag.findMany();
  const nutritionalTags = await prisma.nutritionalTag.findMany();

  const recipes = [
    {
      name: 'Low-FODMAP Chicken & Rice Bowl',
      description: 'Gentle on the digestive system, perfect for IBS management',
      servings: 4,
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      totalTimeMinutes: 30,
      complexity: 2,
      costTier: 'budget',
      requiredAppliances: ['stove'],
      goalTags: ['weight_loss', 'ibs_management'],
      ingredients: [
        { name: 'Chicken breast', amount: 1, unit: 'lb', category: 'protein' },
        { name: 'White rice', amount: 1, unit: 'cup', category: 'grain' },
        { name: 'Carrots', amount: 2, unit: 'medium', category: 'vegetable' },
        { name: 'Zucchini', amount: 1, unit: 'medium', category: 'vegetable' },
        { name: 'Olive oil', amount: 2, unit: 'tbsp', category: 'fat' },
        { name: 'Salt', amount: 1, unit: 'tsp', category: 'spice' },
        { name: 'Black pepper', amount: 0.5, unit: 'tsp', category: 'spice' }
      ],
      instructions: [
        { stepNumber: 1, instruction: 'Cook rice according to package directions' },
        { stepNumber: 2, instruction: 'Season chicken with salt and pepper, cook in olive oil until done' },
        { stepNumber: 3, instruction: 'Sauté carrots and zucchini until tender' },
        { stepNumber: 4, instruction: 'Serve chicken and vegetables over rice' }
      ],
      nutritionalInfo: {
        calories: 380,
        protein: 35,
        carbohydrates: 45,
        fat: 8,
        fiber: 3,
        sugar: 6,
        sodium: 450,
        cholesterol: 85
      },
      medicalTags: ['Low-FODMAP', 'IBS-Friendly', 'Gut-Healing'],
      dietaryTags: ['Gluten-Free', 'Dairy-Free'],
      practicalTags: ['Quick-Cook', 'Beginner-Friendly', 'Batch-Cookable'],
      nutritionalTags: ['High-Protein', 'Low-Calorie']
    },
    {
      name: 'Mediterranean Quinoa Salad',
      description: 'Heart-healthy Mediterranean flavors with plant-based protein',
      servings: 6,
      prepTimeMinutes: 15,
      cookTimeMinutes: 15,
      totalTimeMinutes: 30,
      complexity: 2,
      costTier: 'moderate',
      requiredAppliances: ['stove'],
      goalTags: ['heart_health', 'general_health'],
      ingredients: [
        { name: 'Quinoa', amount: 1.5, unit: 'cups', category: 'grain' },
        { name: 'Cherry tomatoes', amount: 2, unit: 'cups', category: 'vegetable' },
        { name: 'Cucumber', amount: 1, unit: 'large', category: 'vegetable' },
        { name: 'Red onion', amount: 0.5, unit: 'medium', category: 'vegetable' },
        { name: 'Kalamata olives', amount: 0.5, unit: 'cup', category: 'fat' },
        { name: 'Feta cheese', amount: 4, unit: 'oz', category: 'dairy' },
        { name: 'Extra virgin olive oil', amount: 3, unit: 'tbsp', category: 'fat' },
        { name: 'Lemon juice', amount: 2, unit: 'tbsp', category: 'liquid' },
        { name: 'Fresh herbs', amount: 0.25, unit: 'cup', category: 'herb' }
      ],
      instructions: [
        { stepNumber: 1, instruction: 'Cook quinoa according to package directions and let cool' },
        { stepNumber: 2, instruction: 'Dice tomatoes, cucumber, and red onion' },
        { stepNumber: 3, instruction: 'Whisk together olive oil and lemon juice' },
        { stepNumber: 4, instruction: 'Combine all ingredients and toss with dressing' },
        { stepNumber: 5, instruction: 'Chill for 30 minutes before serving' }
      ],
      nutritionalInfo: {
        calories: 295,
        protein: 12,
        carbohydrates: 38,
        fat: 12,
        fiber: 5,
        sugar: 8,
        sodium: 380,
        cholesterol: 15
      },
      medicalTags: ['Heart-Healthy', 'Anti-Inflammatory'],
      dietaryTags: ['Vegetarian', 'Mediterranean', 'Gluten-Free'],
      practicalTags: ['No-Cook', 'Batch-Cookable', 'Portable'],
      nutritionalTags: ['High-Fiber', 'Healthy-Fats', 'Antioxidant-Rich']
    },
    {
      name: 'Diabetic-Friendly Salmon with Roasted Vegetables',
      description: 'Blood sugar stable meal with omega-3 rich salmon',
      servings: 4,
      prepTimeMinutes: 10,
      cookTimeMinutes: 30,
      totalTimeMinutes: 40,
      complexity: 2,
      costTier: 'premium',
      requiredAppliances: ['oven'],
      goalTags: ['diabetes_management', 'heart_health'],
      ingredients: [
        { name: 'Salmon fillets', amount: 1.5, unit: 'lbs', category: 'protein' },
        { name: 'Broccoli', amount: 2, unit: 'cups', category: 'vegetable' },
        { name: 'Brussels sprouts', amount: 2, unit: 'cups', category: 'vegetable' },
        { name: 'Sweet potato', amount: 1, unit: 'medium', category: 'vegetable' },
        { name: 'Olive oil', amount: 2, unit: 'tbsp', category: 'fat' },
        { name: 'Garlic', amount: 3, unit: 'cloves', category: 'vegetable' },
        { name: 'Lemon', amount: 1, unit: 'whole', category: 'fruit' },
        { name: 'Herbs de Provence', amount: 1, unit: 'tsp', category: 'herb' }
      ],
      instructions: [
        { stepNumber: 1, instruction: 'Preheat oven to 425°F' },
        { stepNumber: 2, instruction: 'Cut vegetables into uniform pieces' },
        { stepNumber: 3, instruction: 'Toss vegetables with olive oil and seasonings' },
        { stepNumber: 4, instruction: 'Roast vegetables for 15 minutes' },
        { stepNumber: 5, instruction: 'Add salmon to pan and roast 12-15 minutes more' },
        { stepNumber: 6, instruction: 'Serve with lemon wedges' }
      ],
      nutritionalInfo: {
        calories: 325,
        protein: 28,
        carbohydrates: 22,
        fat: 16,
        fiber: 6,
        sugar: 10,
        sodium: 320,
        cholesterol: 65
      },
      medicalTags: ['Diabetes-Friendly', 'Low-Glycemic', 'Heart-Healthy', 'Anti-Inflammatory'],
      dietaryTags: ['Gluten-Free', 'Dairy-Free', 'Paleo'],
      practicalTags: ['Quick-Cook', 'One-Pot', 'Beginner-Friendly'],
      nutritionalTags: ['High-Protein', 'Omega-3-Rich', 'High-Fiber', 'Antioxidant-Rich']
    }
  ];

  for (const recipeData of recipes) {
    // Create the recipe
    const recipe = await prisma.recipe.create({
      data: {
        name: recipeData.name,
        description: recipeData.description,
        servings: recipeData.servings,
        prepTimeMinutes: recipeData.prepTimeMinutes,
        cookTimeMinutes: recipeData.cookTimeMinutes,
        totalTimeMinutes: recipeData.totalTimeMinutes,
        complexity: recipeData.complexity,
        costTier: recipeData.costTier,
        requiredAppliances: JSON.stringify(recipeData.requiredAppliances),
        goalTags: JSON.stringify(recipeData.goalTags)
      }
    });

    // Add ingredients
    for (const ingredient of recipeData.ingredients) {
      await prisma.recipeIngredient.create({
        data: {
          recipeId: recipe.id,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit
        }
      });
    }

    // Add instructions
    for (const instruction of recipeData.instructions) {
      await prisma.recipeInstruction.create({
        data: {
          recipeId: recipe.id,
          stepNumber: instruction.stepNumber,
          instruction: instruction.instruction
        }
      });
    }

    // Add nutritional info
    await prisma.nutritionalInfo.create({
      data: {
        recipeId: recipe.id,
        ...recipeData.nutritionalInfo
      }
    });

    // Add medical tags
    for (const tagName of recipeData.medicalTags) {
      const tag = medicalTags.find((t: any) => t.name === tagName);
      if (tag) {
        await prisma.recipeMedicalTag.create({
          data: {
            recipeId: recipe.id,
            medicalTagId: tag.id
          }
        });
      }
    }

    // Add dietary tags
    for (const tagName of recipeData.dietaryTags) {
      const tag = dietaryTags.find((t: any) => t.name === tagName);
      if (tag) {
        await prisma.recipeDietaryTag.create({
          data: {
            recipeId: recipe.id,
            dietaryTagId: tag.id
          }
        });
      }
    }

    // Add practical tags
    for (const tagName of recipeData.practicalTags) {
      const tag = practicalTags.find((t: any) => t.name === tagName);
      if (tag) {
        await prisma.recipePracticalTag.create({
          data: {
            recipeId: recipe.id,
            practicalTagId: tag.id
          }
        });
      }
    }

    // Add nutritional tags
    for (const tagName of recipeData.nutritionalTags) {
      const tag = nutritionalTags.find((t: any) => t.name === tagName);
      if (tag) {
        await prisma.recipeNutritionalTag.create({
          data: {
            recipeId: recipe.id,
            nutritionalTagId: tag.id
          }
        });
      }
    }
  }
}

async function seedSampleUsers() {
  console.log('👥 Seeding sample users...');

  // Create test user profiles for different niches
  const users = [
    {
      email: 'ibs.user@example.com',
      name: 'Sarah IBS',
      primaryGoal: 'MEDICAL_CONDITION',
      healthConditions: ['IBS (Irritable Bowel Syndrome)'],
      preferences: {
        cookingSkillLevel: 'INTERMEDIATE',
        maxPrepTimeMinutes: 30,
        budgetRange: 'MODERATE',
        householdSize: 2,
        mealsPerDay: 3,
        snacksPerDay: 2,
        batchCookingPreference: true
      }
    },
    {
      email: 'diabetes.user@example.com',
      name: 'John Diabetes',
      primaryGoal: 'MEDICAL_CONDITION',
      healthConditions: ['Type 2 Diabetes'],
      preferences: {
        cookingSkillLevel: 'BEGINNER',
        maxPrepTimeMinutes: 45,
        budgetRange: 'BUDGET',
        householdSize: 4,
        mealsPerDay: 3,
        snacksPerDay: 3,
        batchCookingPreference: false
      }
    },
    {
      email: 'vegan.user@example.com',
      name: 'Emma Vegan',
      primaryGoal: 'LIFESTYLE_DIET',
      preferences: {
        cookingSkillLevel: 'ADVANCED',
        maxPrepTimeMinutes: 60,
        budgetRange: 'PREMIUM',
        householdSize: 1,
        mealsPerDay: 3,
        snacksPerDay: 1,
        batchCookingPreference: true
      }
    }
  ];

  for (const userData of users) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        primaryGoal: userData.primaryGoal as any,
        preferences: {
          create: userData.preferences as any
        }
      }
    });

    // Add health conditions if any
    if (userData.healthConditions) {
      for (const conditionName of userData.healthConditions) {
        const condition = await prisma.healthCondition.findFirst({
          where: { name: conditionName }
        });
        
        if (condition) {
          await prisma.userHealthCondition.create({
            data: {
              userId: user.id,
              healthConditionId: condition.id,
              severity: 'MODERATE'
            }
          });
        }
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 