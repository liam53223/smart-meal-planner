const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function checkRecipeCount() {
  try {
    const count = await prisma.recipe.count();
    console.log(`\n📊 Total recipes in database: ${count}\n`);
    
    // Get a sample of recipes
    const samples = await prisma.recipe.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('📝 Latest 5 recipes:');
    samples.forEach((recipe, index) => {
      console.log(`   ${index + 1}. ${recipe.name} (${recipe.totalTimeMinutes} mins)`);
    });
    
    // Check distribution by complexity
    const complexityGroups = await prisma.recipe.groupBy({
      by: ['complexity'],
      _count: true
    });
    
    console.log('\n📈 Complexity distribution:');
    complexityGroups.forEach(group => {
      console.log(`   Complexity ${group.complexity}: ${group._count} recipes`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecipeCount(); 