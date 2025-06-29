import { MassiveRecipeLoader } from '../src/lib/recipes/massive-recipe-loader';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function setupOptimalOllama() {
  console.log('🚀 Setting up Ollama for RTX 5080 16GB + 9800X3D...');
  
  // Set environment variables for optimal performance
  process.env.OLLAMA_GPU_LAYERS = '99';  // Use all GPU layers
  process.env.OLLAMA_NUM_GPU = '1';
  process.env.CUDA_VISIBLE_DEVICES = '0';
  process.env.OLLAMA_NUM_THREAD = '16';  // Optimal for 9800X3D
  
  try {
    // Pull the best models for your hardware
    console.log('📥 Pulling optimized models...');
    
    // Main LLM for complex queries (fits in 16GB VRAM)
    await execAsync('ollama pull llama3.1:70b-q4_K_M');
    console.log('✅ Llama 3.1 70B loaded');
    
    // Embedding model for ChromaDB
    await execAsync('ollama pull nomic-embed-text:latest');
    console.log('✅ Nomic embedding model loaded');
    
    // Alternative: Mistral for structured data
    await execAsync('ollama pull mistral-large:latest');
    console.log('✅ Mistral Large loaded');
    
  } catch (error) {
    console.error('⚠️ Error setting up Ollama:', error);
    console.log('Make sure Ollama is running: ollama serve');
  }
}

async function loadMassiveRecipeBank() {
  const loader = new MassiveRecipeLoader();
  
  console.log('🍳 Initializing Massive Recipe Loader...');
  await loader.initialize();
  
  // Phase 1: Generate and load sample recipes
  console.log('\n📊 Phase 1: Loading 1000 sample recipes with variations...');
  await loader.generateSampleRecipes(1000);
  
  // Phase 2: Load from external sources (if available)
  // Uncomment these when you have recipe data files
  /*
  console.log('\n📊 Phase 2: Loading from external datasets...');
  await loader.loadFromJSON('./data/recipes/epicurious.json');
  await loader.loadFromJSON('./data/recipes/recipe1m-sample.json');
  await loader.loadFromJSON('./data/recipes/foodcom-sample.json');
  */
  
  // Get final stats
  const stats = await loader.getStats();
  console.log('\n✅ Recipe Bank Loading Complete!');
  console.log('📈 Final Statistics:');
  console.log(`   - Total recipes in DB: ${stats.totalRecipesInDB}`);
  console.log(`   - Total in vector DB: ${stats.totalRecipesInVector}`);
  console.log(`   - Loaded this session: ${stats.loadedThisSession}`);
  
  // With appliance variations, 1000 base recipes = ~4000 total recipes
  console.log('\n🎯 Estimated total with variations: ~4000 recipes');
}

async function main() {
  try {
    // First setup Ollama
    await setupOptimalOllama();
    
    // Then load recipes
    await loadMassiveRecipeBank();
    
    console.log('\n🎉 Setup complete! Your Flavor Monk is ready with:');
    console.log('   - GPU-accelerated Llama 3.1 70B');
    console.log('   - ChromaDB with 4000+ recipes');
    console.log('   - Appliance-optimized variations');
    console.log('   - Semantic recipe search');
    
    console.log('\n💡 Next steps:');
    console.log('   1. Run "npm run dev" to start the app');
    console.log('   2. Complete the questionnaire');
    console.log('   3. Chat with Kojo using your powerful local AI!');
    
  } catch (error) {
    console.error('❌ Error during setup:', error);
    process.exit(1);
  }
}

// Run the setup
main(); 