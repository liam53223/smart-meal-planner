import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

export const seedAppliances = async () => {
  console.log('🔧 Seeding appliances...');

  const appliances = [
    // Cooking appliances
    { name: 'oven', displayName: 'Oven', category: 'cooking' },
    { name: 'stove', displayName: 'Stove/Hob', category: 'cooking' },
    { name: 'microwave', displayName: 'Microwave', category: 'cooking' },
    { name: 'air_fryer', displayName: 'Air Fryer', category: 'cooking' },
    { name: 'instant_pot', displayName: 'Instant Pot/Pressure Cooker', category: 'cooking' },
    { name: 'slow_cooker', displayName: 'Slow Cooker/Crock Pot', category: 'cooking' },
    { name: 'sous_vide', displayName: 'Sous Vide', category: 'cooking' },
    { name: 'grill', displayName: 'Grill/BBQ', category: 'cooking' },
    { name: 'toaster_oven', displayName: 'Toaster Oven', category: 'cooking' },
    
    // Prep appliances
    { name: 'blender', displayName: 'Blender', category: 'prep' },
    { name: 'food_processor', displayName: 'Food Processor', category: 'prep' },
    { name: 'stand_mixer', displayName: 'Stand Mixer', category: 'prep' },
    { name: 'hand_mixer', displayName: 'Hand Mixer', category: 'prep' },
    { name: 'immersion_blender', displayName: 'Immersion Blender', category: 'prep' },
    
    // Storage
    { name: 'freezer', displayName: 'Freezer (separate)', category: 'storage' },
    { name: 'vacuum_sealer', displayName: 'Vacuum Sealer', category: 'storage' },
  ];

  for (const appliance of appliances) {
    await prisma.appliance.upsert({
      where: { name: appliance.name },
      update: {},
      create: appliance,
    });
  }

  console.log(`✅ Seeded ${appliances.length} appliances`);
};

// Run if called directly
if (require.main === module) {
  seedAppliances()
    .then(() => {
      console.log('Appliance seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error seeding appliances:', error);
      process.exit(1);
    });
} 