import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

export const seedSpiceBlends = async () => {
  console.log('🌶️ Seeding evidence-based spice blends...');

  const spiceBlends = [
    {
      name: 'turmeric_black_pepper',
      displayName: 'Turmeric + Black Pepper',
      activeCompounds: ['Curcumin', 'Piperine'],
      clinicalEvidence: 'A_RCT',
      primaryBenefit: 'Anti-inflammatory',
      effectiveDoseGrams: 1.0,
      bioavailabilityHack: 'Piperine increases absorption by 2000%',
      quickApplications: ['Golden milk', 'Curry base', 'Smoothies'],
    },
    {
      name: 'cinnamon',
      displayName: 'Ceylon Cinnamon',
      activeCompounds: ['Cinnamaldehyde'],
      clinicalEvidence: 'A_RCT',
      primaryBenefit: 'Glucose control',
      effectiveDoseGrams: 4.5, // 3-6g range midpoint
      bioavailabilityHack: 'Take with fat/meal for best absorption',
      quickApplications: ['Oatmeal', 'Smoothies', 'Coffee'],
    },
    {
      name: 'ginger',
      displayName: 'Fresh Ginger',
      activeCompounds: ['Gingerol'],
      clinicalEvidence: 'A_RCT',
      primaryBenefit: 'Anti-inflammatory',
      effectiveDoseGrams: 2.0, // 1-3g range midpoint
      bioavailabilityHack: 'Consume with fat for better absorption',
      quickApplications: ['Tea', 'Stir-fries', 'Smoothies'],
    },
    {
      name: 'fenugreek',
      displayName: 'Fenugreek Seeds',
      activeCompounds: ['Trigonelline'],
      clinicalEvidence: 'A_RCT',
      primaryBenefit: 'Lipid control',
      effectiveDoseGrams: 15.0, // 5-25g range midpoint
      bioavailabilityHack: 'Soak in water before use',
      quickApplications: ['Smoothies', 'Bread', 'Curry'],
    },
    {
      name: 'cardamom',
      displayName: 'Green Cardamom',
      activeCompounds: ['α-terpineol'],
      clinicalEvidence: 'B_MULTIPLE',
      primaryBenefit: 'Anti-inflammatory',
      effectiveDoseGrams: 3.0,
      bioavailabilityHack: 'Grind fresh for maximum potency',
      quickApplications: ['Coffee', 'Desserts', 'Tea'],
    },
    {
      name: 'sumac',
      displayName: 'Sumac Powder',
      activeCompounds: ['Gallotannins'],
      clinicalEvidence: 'B_LIMITED',
      primaryBenefit: 'Antioxidant',
      effectiveDoseGrams: 3.0,
      bioavailabilityHack: 'Combine with vitamin C sources',
      quickApplications: ['Salad dressing', 'Roasted vegetables', 'Yogurt'],
    },
    {
      name: 'italian_herbs',
      displayName: 'Italian Herb Mix',
      activeCompounds: ['Mixed polyphenols'],
      clinicalEvidence: 'B_RCT',
      primaryBenefit: 'Vascular function',
      effectiveDoseGrams: 6.0,
      bioavailabilityHack: 'Use with olive oil for synergy',
      quickApplications: ['Roasted vegetables', 'Pasta', 'Salads'],
    },
    {
      name: 'pumpkin_pie_spice',
      displayName: 'Pumpkin Pie Spice',
      activeCompounds: ['Cinnamaldehyde', 'Gingerol'],
      clinicalEvidence: 'B_RCT',
      primaryBenefit: 'Glucose control',
      effectiveDoseGrams: 6.0,
      bioavailabilityHack: 'Consume with fat for absorption',
      quickApplications: ['Baked goods', 'Lattes', 'Oatmeal'],
    },
    {
      name: 'garlic_onion',
      displayName: 'Garlic + Onion Powder',
      activeCompounds: ['Allicin', 'Quercetin'],
      clinicalEvidence: 'B_OBSERVATIONAL',
      primaryBenefit: 'Cardiovascular health',
      effectiveDoseGrams: 3.5, // 2-5g range midpoint
      bioavailabilityHack: 'Crush fresh garlic and let sit 10 min',
      quickApplications: ['Everything seasoning', 'Marinades', 'Roasts'],
    },
    {
      name: 'chili_pepper',
      displayName: 'Chili Pepper (Capsaicin)',
      activeCompounds: ['Capsaicin'],
      clinicalEvidence: 'A_RCT',
      primaryBenefit: 'Thermogenesis',
      effectiveDoseGrams: 0.005, // 2-9mg capsaicin
      bioavailabilityHack: 'Consume with fat to reduce burning',
      quickApplications: ['Hot sauces', 'Soups', 'Stir-fries'],
    },
  ];

  for (const blend of spiceBlends) {
    // Convert arrays to JSON strings for SQLite compatibility
    const processedBlend = {
      ...blend,
      activeCompounds: Array.isArray(blend.activeCompounds) 
        ? JSON.stringify(blend.activeCompounds) 
        : blend.activeCompounds,
      quickApplications: Array.isArray(blend.quickApplications) 
        ? JSON.stringify(blend.quickApplications) 
        : blend.quickApplications,
    };
    
    await prisma.spiceBlend.upsert({
      where: { name: blend.name },
      update: {},
      create: processedBlend,
    });
  }

  console.log(`✅ Seeded ${spiceBlends.length} evidence-based spice blends`);
};

// Run if called directly
if (require.main === module) {
  seedSpiceBlends()
    .then(() => {
      console.log('Spice blend seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error seeding spice blends:', error);
      process.exit(1);
    });
} 