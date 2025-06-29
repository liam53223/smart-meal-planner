// Bulk Recipe Loader - Simple and Reliable
const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

// Recipe name templates
const recipeNames = {
  breakfast: [
    'Protein Power Overnight Oats',
    'Quick Scrambled Eggs with Spinach',
    'Berry Blast Smoothie Bowl',
    'Avocado Toast with Poached Egg',
    'Greek Yogurt Berry Parfait',
    'Banana Protein Pancakes',
    'Veggie Breakfast Burrito',
    'Chia Seed Pudding',
    'Whole Wheat French Toast',
    'Egg White Muffins'
  ],
  lunch: [
    'Mediterranean Quinoa Bowl',
    'Grilled Chicken Caesar Salad',
    'Asian Sesame Noodle Bowl',
    'Turkey and Avocado Wrap',
    'Lentil Vegetable Soup',
    'Tuna Melt Sandwich',
    'Thai Peanut Buddha Bowl',
    'Mexican Black Bean Bowl',
    'Power Green Salad',
    'Stuffed Sweet Potato'
  ],
  dinner: [
    'Teriyaki Chicken Stir Fry',
    'Baked Lemon Herb Salmon',
    'Beef and Broccoli Bowl',
    'Chickpea Tikka Masala',
    'Sheet Pan Fajitas',
    'Spaghetti with Turkey Meatballs',
    'Honey Garlic Shrimp',
    'Vegetable Pad Thai',
    'Slow Cooker Chili',
    'Roasted Chicken with Vegetables'
  ],
  snacks: [
    'Peanut Butter Energy Balls',
    'Hummus with Veggie Sticks',
    'Trail Mix Power Pack',
    'Protein Smoothie',
    'Apple Slices with Almond Butter',
    'Greek Yogurt with Granola',
    'Air Fryer Chickpeas',
    'Cottage Cheese Bowl',
    'Rice Cakes with Toppings',
    'Hard Boiled Eggs'
  ]
};

const appliances = ['stovetop', 'oven', 'microwave', 'air fryer', 'instant pot', 'blender', 'no cook'];
const difficulties = ['Easy', 'Medium', 'Hard'];
const costTiers = ['budget', 'moderate', 'premium'];
const healthGoals = ['weight_loss', 'muscle_gain', 'heart_health', 'energy_boost', 'general_health'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function createRecipe(name, mealType, index) {
  const prepTime = getRandomNumber(5, 20);
  const cookTime = mealType === 'snacks' ? getRandomNumber(0, 10) : getRandomNumber(10, 40);
  
  const recipe = {
    name: `${name} #${index}`,
    description: `Delicious and healthy ${name.toLowerCase()} perfect for ${mealType}`,
    prepTimeMinutes: prepTime,
    cookTimeMinutes: cookTime,
    totalTimeMinutes: prepTime + cookTime,
    servings: mealType === 'snacks' ? 2 : 4,
    complexity: getRandomNumber(1, 5),
    costTier: getRandomElement(costTiers),
    requiredAppliances: JSON.stringify([getRandomElement(appliances)]),
    goalTags: JSON.stringify([getRandomElement(healthGoals), mealType]),
    ingredients: {
      create: [
        { name: 'main ingredient', amount: 1, unit: 'cup' },
        { name: 'seasoning', amount: 1, unit: 'tsp' },
        { name: 'oil', amount: 1, unit: 'tbsp' },
        { name: 'vegetable', amount: 2, unit: 'cups' }
      ]
    },
    instructions: {
      create: [
        { stepNumber: 1, instruction: 'Prepare all ingredients' },
        { stepNumber: 2, instruction: 'Cook according to recipe' },
        { stepNumber: 3, instruction: 'Season to taste' },
        { stepNumber: 4, instruction: 'Serve and enjoy' }
      ]
    },
    nutritionalInfo: {
      create: {
        calories: getRandomNumber(200, 600),
        protein: getRandomNumber(10, 40),
        carbohydrates: getRandomNumber(20, 60),
        fat: getRandomNumber(5, 25),
        fiber: getRandomNumber(2, 15),
        sodium: getRandomNumber(200, 800)
      }
    }
  };
  
  return recipe;
}

async function bulkLoadRecipes() {
  console.log('🚀 Starting bulk recipe load...\n');
  
  try {
    let totalCreated = 0;
    const targetPerMealType = {
      breakfast: 25,
      lunch: 30,
      dinner: 35,
      snacks: 20
    };
    
    for (const [mealType, names] of Object.entries(recipeNames)) {
      const target = targetPerMealType[mealType] || 20;
      console.log(`📝 Creating ${target} ${mealType} recipes...`);
      
      let created = 0;
      
      // Create multiple versions of each recipe name
      for (let i = 0; i < target; i++) {
        const name = names[i % names.length];
        
        try {
          const recipe = await createRecipe(name, mealType, totalCreated + 1);
          await prisma.recipe.create({ data: recipe });
          
          created++;
          totalCreated++;
          
          if (created % 5 === 0) {
            process.stdout.write(`  ✓ ${created}/${target} `);
          }
        } catch (error) {
          console.error(`\n  ❌ Error creating ${name}: ${error.message}`);
        }
      }
      
      console.log(`\n  ✅ Created ${created} ${mealType} recipes\n`);
    }
    
    // Final count
    const finalCount = await prisma.recipe.count();
    console.log(`\n🎉 Success! Total recipes in database: ${finalCount}`);
    console.log(`   Created ${totalCreated} new recipes in this session\n`);
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the loader
bulkLoadRecipes(); 