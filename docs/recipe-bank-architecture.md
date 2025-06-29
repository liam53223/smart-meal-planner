# 🍳 Recipe Bank Architecture - Optimized for RTX 5080 + 9800X3D

## Current Status
- **Recipes in Database**: 3 sample recipes only
- **Need**: 1000+ recipes with rich metadata

## Recommended Architecture for Your Hardware

### 1. Vector Database: ChromaDB + PostgreSQL Hybrid
```
ChromaDB: Recipe semantic search (GPU-accelerated embeddings)
PostgreSQL: Structured data (ingredients, nutrition, tags)
SQLite: Fallback for offline/simple queries
```

### 2. Optimal Local LLM Setup for RTX 5080 16GB

#### Model Recommendations (June 2025)
```bash
# For recipe generation and complex queries
ollama pull llama3.1:70b-q4_K_M  # Fits in 16GB VRAM
ollama pull mistral-large:latest  # Alternative, very good for structured data

# For embeddings (ChromaDB)
ollama pull nomic-embed-text:latest  # Fast, efficient embeddings
```

#### GPU Optimization
```bash
# Enable GPU acceleration
export OLLAMA_GPU_LAYERS=99  # Use all layers on GPU
export OLLAMA_NUM_GPU=1
export CUDA_VISIBLE_DEVICES=0

# For your 9800X3D (optimal thread count)
export OLLAMA_NUM_THREAD=16  # Half your physical cores for best performance
```

### 3. Recipe Data Sources & Import Strategy

#### Phase 1: Bulk Import (10,000+ recipes)
1. **Open Recipe Databases**:
   - Recipe1M dataset (1 million recipes)
   - Epicurious dataset (20k recipes with ratings)
   - Food.com dataset (180k recipes)

2. **Web Scraping** (with permission):
   - AllRecipes API
   - Spoonacular API (150 calls/day free)
   - USDA Food Database

#### Phase 2: AI Enhancement
- Use Llama 70B to generate appliance variations
- Create dietary adaptations (vegan, keto, etc.)
- Add missing nutritional data

### 4. ChromaDB Implementation

```typescript
// Optimal settings for RTX 5080
const chromaSettings = {
  path: './chroma-db',
  similarity: 'cosine',
  embedding_function: 'ollama/nomic-embed-text',
  distance_threshold: 0.7,
  
  // GPU-optimized batch sizes
  batch_size: 512,  // RTX 5080 can handle large batches
  max_memory: 12_000_000_000,  // 12GB for ChromaDB
};
```

### 5. Recipe Scoring Algorithm

```typescript
interface RecipeScore {
  appliance_match: number;      // 0-1: User has required appliances
  time_match: number;           // 0-1: Fits time constraints  
  skill_match: number;          // 0-1: Matches skill level
  dietary_match: number;        // 0-1: Meets dietary needs
  nutrition_match: number;      // 0-1: Aligns with health goals
  preference_match: number;     // 0-1: Cuisine/flavor preferences
  
  // Weighted score
  final_score: number;          // Weighted combination
}
```

### 6. Performance Targets
- Recipe search: <100ms (using GPU embeddings)
- Recipe generation: <2s (using local 70B model)
- Bulk import: 1000 recipes/minute
- Concurrent users: 100+ (with your hardware)

## Implementation Plan

### Week 1: Infrastructure
- [ ] Install ChromaDB with GPU support
- [ ] Set up embedding pipeline
- [ ] Configure Llama 70B for your GPU
- [ ] Create import scripts

### Week 2: Data Collection
- [ ] Download open recipe datasets
- [ ] Parse and normalize data
- [ ] Generate embeddings (overnight job)
- [ ] Import to ChromaDB + PostgreSQL

### Week 3: AI Enhancement
- [ ] Generate appliance variations
- [ ] Create dietary adaptations
- [ ] Fill missing nutrition data
- [ ] Add flavor profiles

### Week 4: Integration
- [ ] Connect ChromaDB to Kojo
- [ ] Implement scoring algorithm
- [ ] Add semantic search
- [ ] Performance optimization 