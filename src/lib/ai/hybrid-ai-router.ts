// Hybrid AI Router for Budget-Conscious Deployment
// Uses local Ollama for 80% of queries, Claude for complex nutrition science

interface AIQuery {
  type: 'recipe' | 'meal_plan' | 'nutrition_science' | 'cooking_help' | 'general';
  query: string;
  context?: any;
}

interface AIResponse {
  response: string;
  source: 'local' | 'claude' | 'fallback';
  cost: number;
}

export class HybridAIRouter {
  private dailyCloudBudget = 5; // £5/day max
  private dailyCloudSpend = 0;
  private lastResetDate = new Date().toDateString();
  
  constructor(
    private ollamaEndpoint = 'http://localhost:11434',
    private claudeApiKey?: string
  ) {}

  async route(query: AIQuery): Promise<AIResponse> {
    // Reset daily budget if new day
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailyCloudSpend = 0;
      this.lastResetDate = today;
    }

    // Determine if query needs cloud AI
    const needsCloudAI = this.requiresCloudAI(query);
    
    // Route to appropriate service
    if (!needsCloudAI || this.dailyCloudSpend >= this.dailyCloudBudget) {
      return this.handleLocalQuery(query);
    } else {
      return this.handleCloudQuery(query);
    }
  }

  private requiresCloudAI(query: AIQuery): boolean {
    // Complex queries that need Claude
    const complexPatterns = [
      /micronutrient.*interaction/i,
      /clinical.*evidence/i,
      /medical.*condition/i,
      /drug.*food.*interaction/i,
      /bioavailability/i,
      /glycemic.*load.*calculation/i,
      /nutrient.*deficiency.*analysis/i
    ];

    return complexPatterns.some(pattern => pattern.test(query.query));
  }

  private async handleLocalQuery(query: AIQuery): Promise<AIResponse> {
    try {
      // Call local Ollama
      const response = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.3:7b',
          prompt: this.buildPrompt(query),
          stream: false
        })
      });

      const data = await response.json();
      
      return {
        response: data.response,
        source: 'local',
        cost: 0
      };
    } catch (error) {
      // Fallback to free services
      return this.handleFallback(query);
    }
  }

  private async handleCloudQuery(query: AIQuery): Promise<AIResponse> {
    if (!this.claudeApiKey) {
      return this.handleLocalQuery(query);
    }

    try {
      // Estimate cost (£0.015 per 1K tokens for Claude Opus)
      const estimatedTokens = query.query.length / 4 * 2; // rough estimate
      const estimatedCost = (estimatedTokens / 1000) * 0.015;
      
      if (this.dailyCloudSpend + estimatedCost > this.dailyCloudBudget) {
        return this.handleLocalQuery(query);
      }

      // Call Claude API (implementation depends on your setup)
      // This is a placeholder - implement actual Claude API call
      const response = await this.callClaudeAPI(query);
      
      this.dailyCloudSpend += estimatedCost;
      
      return {
        response: response,
        source: 'claude',
        cost: estimatedCost
      };
    } catch (error) {
      return this.handleLocalQuery(query);
    }
  }

  private async handleFallback(query: AIQuery): Promise<AIResponse> {
    // Use HuggingChat or Cohere free tier as fallback
    // This is a placeholder implementation
    return {
      response: this.generateBasicResponse(query),
      source: 'fallback',
      cost: 0
    };
  }

  private buildPrompt(query: AIQuery): string {
    const systemPrompt = `You are Flavor Monk (Kojo), an empathetic AI nutrition assistant with expertise in culinary science and evidence-based nutrition. You speak in a warm, encouraging tone while providing practical, scientifically-sound advice.`;
    
    const contextPrompt = query.context 
      ? `\nUser Context: ${JSON.stringify(query.context)}`
      : '';
    
    return `${systemPrompt}${contextPrompt}\n\nUser Query: ${query.query}\n\nResponse:`;
  }

  private generateBasicResponse(query: AIQuery): string {
    // Basic responses for when all AI services fail
    const responses: Record<string, string> = {
      recipe: "I'd be happy to help you find a recipe! Based on your preferences, I suggest starting with simple, nutritious meals that fit your cooking skills and available time.",
      meal_plan: "Let me create a balanced meal plan for you. Focus on variety, seasonal ingredients, and meals you can prep in advance.",
      general: "I'm here to help with your nutrition journey. What specific aspect would you like to explore?"
    };
    
    return responses[query.type] || responses.general;
  }

  private async callClaudeAPI(query: AIQuery): Promise<string> {
    // Implement actual Claude API call here
    // This is a placeholder
    return "Claude API response would go here";
  }

  // Cache common responses to reduce API calls
  private responseCache = new Map<string, AIResponse>();
  
  async routeWithCache(query: AIQuery): Promise<AIResponse> {
    const cacheKey = `${query.type}:${query.query}`;
    
    if (this.responseCache.has(cacheKey)) {
      const cached = this.responseCache.get(cacheKey)!;
      return { ...cached, cost: 0 }; // No cost for cached responses
    }
    
    const response = await this.route(query);
    
    // Cache successful responses
    if (response.source !== 'fallback') {
      this.responseCache.set(cacheKey, response);
    }
    
    return response;
  }
} 