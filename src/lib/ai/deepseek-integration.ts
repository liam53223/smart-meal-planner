// DeepSeek-R1 Integration for Flavor Monk
// Best price-to-performance ratio as of June 2025

interface DeepSeekConfig {
  apiKey: string;
  model: 'deepseek-chat' | 'deepseek-r1' | 'deepseek-v3';
  baseURL?: string;
  maxRetries?: number;
}

export class DeepSeekClient {
  private config: DeepSeekConfig;
  private headers: Record<string, string>;

  constructor(config: DeepSeekConfig) {
    this.config = {
      baseURL: 'https://api.deepseek.com/v1',
      maxRetries: 3,
      ...config
    };
    
    this.headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async generateRecipe(
    userProfile: any,
    request: string
  ): Promise<{ recipe: any; cost: number }> {
    const systemPrompt = this.buildRecipeSystemPrompt(userProfile);
    
    const response = await this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    // Parse structured recipe response
    const recipe = JSON.parse(response.content);
    
    return {
      recipe,
      cost: response.usage.total_cost
    };
  }

  async generateMealPlan(
    userProfile: any,
    days: number = 7
  ): Promise<{ plan: any; cost: number }> {
    const prompt = `Create a ${days}-day meal plan for:
    - Dietary restrictions: ${userProfile.allergies.join(', ')}
    - Cooking time: ${userProfile.maxPrepTime} minutes max
    - Appliances: ${userProfile.appliances.join(', ')}
    - Budget: ${userProfile.budgetRange}
    - Household size: ${userProfile.householdSize}
    
    Include breakfast, lunch, dinner, and snacks.
    Optimize for nutrition, variety, and batch cooking.
    Format as JSON with shopping list.`;

    const response = await this.chat({
      messages: [
        { 
          role: 'system', 
          content: 'You are Kojo, a wise meal planning assistant. Generate practical, delicious meal plans.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 4000
    });

    return {
      plan: JSON.parse(response.content),
      cost: response.usage.total_cost
    };
  }

  private async chat(params: {
    messages: Array<{ role: string; content: string }>;
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
    response_format?: { type: string };
  }): Promise<any> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: this.config.model,
          messages: params.messages,
          temperature: params.temperature || 0.7,
          max_tokens: params.max_tokens || 1000,
          stream: params.stream || false,
          response_format: params.response_format
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Calculate cost (DeepSeek pricing as of June 2025)
      const inputTokens = data.usage.prompt_tokens;
      const outputTokens = data.usage.completion_tokens;
      const inputCost = (inputTokens / 1_000_000) * 0.55;
      const outputCost = (outputTokens / 1_000_000) * 2.19;
      
      return {
        content: data.choices[0].message.content,
        usage: {
          prompt_tokens: inputTokens,
          completion_tokens: outputTokens,
          total_cost: inputCost + outputCost
        },
        latency: Date.now() - startTime
      };
      
    } catch (error) {
      console.error('DeepSeek API error:', error);
      
      // Fallback to local Llama if DeepSeek fails
      if (this.config.maxRetries && this.config.maxRetries > 0) {
        return this.fallbackToLocal(params);
      }
      
      throw error;
    }
  }

  private buildRecipeSystemPrompt(userProfile: any): string {
    return `You are Kojo, the Flavor Monk - a wise culinary AI assistant.
    
User Profile:
- Cooking skill: ${userProfile.cookingSkill}
- Available time: ${userProfile.maxPrepTime} minutes
- Appliances: ${userProfile.appliances.join(', ')}
- Dietary restrictions: ${userProfile.allergies.join(', ')}
- Health goals: ${userProfile.primaryGoal}
- Preferred cuisines: ${userProfile.cuisinePreferences}

When generating recipes:
1. Always include exact measurements and timing
2. Prioritize the user's available appliances
3. Keep within their time constraints
4. Include nutritional information
5. Suggest appliance-specific tips
6. Format response as valid JSON with structure:
{
  "name": "Recipe Name",
  "description": "Brief description",
  "prepTime": 10,
  "cookTime": 20,
  "servings": 4,
  "difficulty": "Easy|Medium|Hard",
  "ingredients": [
    {"item": "chicken breast", "amount": "1", "unit": "lb"}
  ],
  "instructions": ["Step 1", "Step 2"],
  "nutrition": {
    "calories": 300,
    "protein": 25,
    "carbs": 20,
    "fat": 10,
    "fiber": 5
  },
  "appliances": ["Air Fryer"],
  "tags": ["healthy", "quick", "high-protein"],
  "tips": "Air fryer tip: spray with oil for crispiness"
}`;
  }

  private async fallbackToLocal(params: any): Promise<any> {
    // Fallback to local Ollama
    console.log('Falling back to local Llama model...');
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.3:70b',
        prompt: params.messages.map((m: any) => 
          `${m.role}: ${m.content}`
        ).join('\n'),
        stream: false
      })
    });

    const data = await response.json();
    
    return {
      content: data.response,
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_cost: 0 // Free local inference!
      },
      latency: 0
    };
  }

  // Stream responses for better UX
  async *streamChat(params: any): AsyncGenerator<string> {
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        ...params,
        stream: true
      })
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) yield content;
          } catch (e) {
            // Skip parse errors
          }
        }
      }
    }
  }
}

// Cost tracking utility
export class CostTracker {
  private costs: Map<string, number> = new Map();

  track(provider: string, cost: number) {
    const current = this.costs.get(provider) || 0;
    this.costs.set(provider, current + cost);
  }

  getReport(): { provider: string; cost: number }[] {
    return Array.from(this.costs.entries()).map(([provider, cost]) => ({
      provider,
      cost
    }));
  }

  getTotalCost(): number {
    return Array.from(this.costs.values()).reduce((sum, cost) => sum + cost, 0);
  }
} 