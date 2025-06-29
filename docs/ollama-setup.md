# 🤖 Ollama Local AI Setup

## Quick Install (5 minutes)

### Windows
```powershell
# Download and run installer from https://ollama.com/download
# Or use WSL2:
curl -fsSL https://ollama.com/install.sh | sh
```

### Start Ollama
```bash
# Terminal 1: Start Ollama server
ollama serve

# Terminal 2: Pull the model (one-time, ~4GB download)
ollama pull llama3.2:3b  # Smaller, faster (good for recipes)
# OR
ollama pull llama3.3:7b  # Better quality (recommended)
```

## Test Your Setup

```bash
# Quick test
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b",
  "prompt": "Give me a healthy 15-minute recipe",
  "stream": false
}'
```

## Integrate with Flavor Monk

```typescript
// src/lib/ai/kojo.ts
import { HybridAIRouter } from './hybrid-ai-router';

export class Kojo {
  private aiRouter: HybridAIRouter;
  
  constructor() {
    this.aiRouter = new HybridAIRouter(
      process.env.OLLAMA_ENDPOINT || 'http://localhost:11434',
      process.env.CLAUDE_API_KEY // Optional
    );
  }
  
  async chat(message: string, userProfile: any) {
    const response = await this.aiRouter.routeWithCache({
      type: this.classifyQuery(message),
      query: message,
      context: userProfile
    });
    
    return {
      message: response.response,
      cost: response.cost,
      source: response.source
    };
  }
  
  private classifyQuery(message: string): 'recipe' | 'meal_plan' | 'nutrition_science' | 'general' {
    const lower = message.toLowerCase();
    
    if (lower.includes('recipe') || lower.includes('cook') || lower.includes('make')) {
      return 'recipe';
    }
    if (lower.includes('meal plan') || lower.includes('week')) {
      return 'meal_plan';
    }
    if (lower.includes('nutrient') || lower.includes('vitamin') || lower.includes('deficiency')) {
      return 'nutrition_science';
    }
    
    return 'general';
  }
}
```

## Cost Analysis for 20 Customers

### Daily Usage Pattern
- 20 customers × 2.5 conversations/day = 50 conversations
- 50 conversations × 8 messages = 400 messages/day
- 400 messages × 100 tokens = 40,000 tokens/day

### Cost Breakdown

**Local Ollama (80% of queries)**:
- 32,000 tokens/day = **£0** (runs on your machine)
- Response time: ~1-2 seconds

**Claude Opus (20% complex queries)**:
- 8,000 tokens/day = ~£0.12/day
- Monthly: **£3.60**

**Total AI Costs**: £3.60/month for 20 active users! 🎉

### Infrastructure Costs
- Vercel Hobby: £0
- Supabase Free: £0 (easily handles 20 users)
- Domain: £10/month
- **Total**: £13.60/month

### Profit Calculation
- 20 customers × £4.99 = £99.80 revenue
- Minus costs: £13.60
- **Net Profit**: £86.20/month (86% margin!)

## Performance Tips

### 1. Use Smaller Models for Simple Tasks
```typescript
const modelSelector = {
  recipe: 'llama3.2:3b',      // Fast, good for recipes
  meal_plan: 'llama3.3:7b',    // Better reasoning
  nutrition_science: 'claude', // Complex only
};
```

### 2. Pre-warm Common Responses
```typescript
// On startup, generate common responses
const commonQueries = [
  "Give me a 15-minute healthy dinner",
  "What can I make with chicken and rice?",
  "Create a weekly meal plan"
];

// Cache these at startup
```

### 3. Batch Process During Off-Hours
```typescript
// Generate meal plans at 3 AM for next day
async function generateDailyMealPlans() {
  const users = await getActiveUsers();
  for (const user of users) {
    const plan = await generateMealPlan(user.profile);
    await cacheMealPlan(user.id, plan);
  }
}
```

## Scaling Strategy

### 0-50 Users
- Run Ollama on your dev machine
- Use ngrok for testing: `ngrok http 11434`

### 50-200 Users  
- Hetzner VPS (€8.54/month)
- 4GB RAM, 2 vCPU
- Run Ollama + your app

### 200+ Users
- Dedicated GPU server
- OR switch more traffic to cloud APIs
- OR use quantized models

## Troubleshooting

**"Ollama not responding"**
```bash
# Check if running
curl http://localhost:11434/api/tags

# Restart
killall ollama
ollama serve
```

**"Model too slow"**
```bash
# Use smaller model
ollama pull tinyllama:1.1b  # Super fast, lower quality
```

**"Out of memory"**
```bash
# Use quantized version
ollama pull llama3.2:3b-q4_0  # Uses less RAM
``` 