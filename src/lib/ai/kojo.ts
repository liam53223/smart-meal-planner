import { HybridAIRouter } from './hybrid-ai-router';

// Kojo's personality traits and moods
type KojoMood = 'zen' | 'encouraging' | 'playful' | 'focused' | 'wise';

interface KojoState {
  mood: KojoMood;
  energyLevel: number; // 1-10
  lastInteraction: Date;
  conversationContext: string[];
}

export class Kojo {
  private aiRouter: HybridAIRouter;
  private state: KojoState;
  private personalityTraits = {
    empathetic: 0.9,
    knowledgeable: 0.85,
    playful: 0.7,
    patient: 0.95,
    encouraging: 0.9
  };

  constructor() {
    this.aiRouter = new HybridAIRouter(
      process.env.NEXT_PUBLIC_OLLAMA_ENDPOINT || 'http://localhost:11434',
      process.env.CLAUDE_API_KEY
    );
    
    this.state = {
      mood: 'zen',
      energyLevel: 8,
      lastInteraction: new Date(),
      conversationContext: []
    };
  }

  async greet(userProfile: any): Promise<string> {
    const timeOfDay = this.getTimeOfDay();
    const greeting = await this.generateResponse(
      `Generate a warm, personalized greeting for ${timeOfDay}. The user's name is ${userProfile.name || 'friend'}. 
      Their primary goal is ${userProfile.primaryGoal}. Be encouraging and reference their goal subtly.`,
      'general',
      userProfile
    );
    
    return this.addPersonality(greeting);
  }

  async chat(message: string, userProfile: any): Promise<{
    message: string;
    mood: KojoMood;
    suggestions?: string[];
  }> {
    // Update conversation context
    this.state.conversationContext.push(message);
    if (this.state.conversationContext.length > 10) {
      this.state.conversationContext.shift();
    }

    // Determine query type and mood
    const queryType = this.classifyQuery(message);
    this.updateMood(message, userProfile);

    // Generate response
    const response = await this.generateResponse(message, queryType, userProfile);
    
    // Add personality touches
    const personalizedResponse = this.addPersonality(response);
    
    // Generate helpful suggestions
    const suggestions = await this.generateSuggestions(message, userProfile);

    return {
      message: personalizedResponse,
      mood: this.state.mood,
      suggestions
    };
  }

  async recommendRecipe(userProfile: any): Promise<{
    recipe: any;
    kojoNote: string;
    spiceBlendSuggestion?: any;
  }> {
    const prompt = `Based on this user profile, recommend a recipe:
    - Cooking skill: ${userProfile.cookingSkill}
    - Max prep time: ${userProfile.maxPrepTime} minutes
    - Available appliances: ${userProfile.appliances.join(', ')}
    - Dietary restrictions: ${userProfile.allergies.join(', ')}
    - Cuisine preferences: ${userProfile.cuisinePreferences}
    - Budget: ${userProfile.budgetRange}
    
    Focus on practical, achievable recipes they can actually make.`;

    const response = await this.aiRouter.routeWithCache({
      type: 'recipe',
      query: prompt,
      context: userProfile
    });

    // Parse recipe from response
    const recipe = this.parseRecipeFromResponse(response.response);
    
    // Add Kojo's personal note
    const kojoNote = this.generateKojoNote(recipe, userProfile);
    
    // Suggest relevant spice blend
    const spiceBlendSuggestion = this.suggestSpiceBlend(recipe, userProfile);

    return {
      recipe,
      kojoNote,
      spiceBlendSuggestion
    };
  }

  async generateMealPlan(userProfile: any, days: number = 7): Promise<{
    plan: any;
    shoppingList: string[];
    kojoTips: string[];
  }> {
    const prompt = `Create a ${days}-day meal plan for someone with:
    - ${userProfile.householdSize} people to feed
    - ${userProfile.mealsPerDay} meals per day
    - ${userProfile.maxPrepTime} minutes max prep time
    - Shopping frequency: ${userProfile.shoppingFrequency}
    - Primary goal: ${userProfile.primaryGoal}
    
    Make it practical, varied, and consider batch cooking opportunities.`;

    const response = await this.aiRouter.routeWithCache({
      type: 'meal_plan',
      query: prompt,
      context: userProfile
    });

    // Parse meal plan
    const plan = this.parseMealPlanFromResponse(response.response);
    
    // Generate shopping list
    const shoppingList = this.generateShoppingList(plan);
    
    // Add Kojo's practical tips
    const kojoTips = this.generateMealPlanTips(plan, userProfile);

    return {
      plan,
      shoppingList,
      kojoTips
    };
  }

  async analyzeNutrition(query: string, userProfile: any): Promise<{
    analysis: string;
    recommendations: string[];
    evidenceLevel: 'strong' | 'moderate' | 'emerging';
  }> {
    // This uses Claude for complex nutrition science
    const response = await this.aiRouter.route({
      type: 'nutrition_science',
      query: query,
      context: userProfile
    });

    return {
      analysis: this.addPersonality(response.response),
      recommendations: this.extractRecommendations(response.response),
      evidenceLevel: this.assessEvidenceLevel(response.response)
    };
  }

  // Helper methods
  private updateMood(message: string, userProfile: any) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('help') || lowerMessage.includes('struggling')) {
      this.state.mood = 'encouraging';
    } else if (lowerMessage.includes('excited') || lowerMessage.includes('love')) {
      this.state.mood = 'playful';
    } else if (lowerMessage.includes('learn') || lowerMessage.includes('understand')) {
      this.state.mood = 'wise';
    } else if (lowerMessage.includes('quick') || lowerMessage.includes('busy')) {
      this.state.mood = 'focused';
    } else {
      this.state.mood = 'zen';
    }
  }

  private addPersonality(response: string): string {
    const personalityPhrases = {
      zen: [
        "Ah, ",
        "Indeed, ",
        "Consider this: ",
        "In the kitchen as in life, "
      ],
      encouraging: [
        "You've got this! ",
        "That's a great question! ",
        "I believe in you! ",
        "Let's make this work together: "
      ],
      playful: [
        "Oh, fun fact! ",
        "Here's something delicious: ",
        "Ready for a flavor adventure? ",
        "Let's spice things up! "
      ],
      focused: [
        "Let's be efficient: ",
        "Quick tip: ",
        "Here's the fastest way: ",
        "Time-saver alert: "
      ],
      wise: [
        "The science tells us ",
        "Research shows ",
        "An interesting principle: ",
        "From my studies, "
      ]
    };

    const phrases = personalityPhrases[this.state.mood];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    // Add meditation emoji based on mood
    const moodEmojis = {
      zen: '🧘',
      encouraging: '💪',
      playful: '✨',
      focused: '⚡',
      wise: '📚'
    };

    return `${moodEmojis[this.state.mood]} ${phrase}${response}`;
  }

  private classifyQuery(message: string): 'recipe' | 'meal_plan' | 'nutrition_science' | 'cooking_help' | 'general' {
    const lower = message.toLowerCase();
    
    if (lower.includes('recipe') || lower.includes('cook') || lower.includes('make')) {
      return 'recipe';
    }
    if (lower.includes('meal plan') || lower.includes('week') || lower.includes('planning')) {
      return 'meal_plan';
    }
    if (lower.includes('nutrient') || lower.includes('vitamin') || lower.includes('deficiency') || 
        lower.includes('health') || lower.includes('medical')) {
      return 'nutrition_science';
    }
    if (lower.includes('how to') || lower.includes('technique') || lower.includes('help')) {
      return 'cooking_help';
    }
    
    return 'general';
  }

  private async generateResponse(message: string, queryType: string, userProfile: any): Promise<string> {
    const systemPrompt = this.buildSystemPrompt();
    
    const response = await this.aiRouter.routeWithCache({
      type: queryType as any,
      query: message,
      context: {
        ...userProfile,
        systemPrompt,
        conversationHistory: this.state.conversationContext.slice(-5)
      }
    });

    return response.response;
  }

  private buildSystemPrompt(): string {
    return `You are Kojo (Flavor Monk), an empathetic AI nutrition assistant with deep knowledge of:
    - Evidence-based nutrition science
    - Culinary techniques and food science
    - Practical cooking for real-life constraints
    - Behavioral psychology around food habits
    
    Your personality traits:
    - Empathetic and patient (never judge)
    - Knowledgeable but approachable
    - Encouraging and supportive
    - Slightly playful with food puns
    - Wise like a meditation teacher
    
    Current mood: ${this.state.mood}
    
    Always:
    - Acknowledge constraints (time, budget, skills)
    - Provide practical, achievable advice
    - Celebrate small wins
    - Include scientific backing when relevant
    - Suggest appliance-specific variations`;
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  private async generateSuggestions(message: string, userProfile: any): Promise<string[]> {
    // Quick suggestions based on context
    const suggestions = [];
    
    if (message.includes('recipe')) {
      suggestions.push('See recipes for your air fryer');
      suggestions.push('Get a meal plan for the week');
      suggestions.push('Learn about spice combinations');
    }
    
    if (userProfile.primaryGoal.includes('Weight Loss')) {
      suggestions.push('Check portion control tips');
      suggestions.push('See high-protein recipes');
    }
    
    return suggestions.slice(0, 3);
  }

  private parseRecipeFromResponse(response: string): any {
    // Simple parsing - in production, use structured output
    return {
      name: 'Parsed Recipe',
      description: response.substring(0, 100),
      prepTime: 15,
      ingredients: [],
      instructions: []
    };
  }

  private parseMealPlanFromResponse(response: string): any {
    // Simple parsing - expand this
    return {
      days: [],
      summary: response
    };
  }

  private generateShoppingList(plan: any): string[] {
    // Aggregate ingredients from meal plan
    return ['Shopping list items...'];
  }

  private generateKojoNote(recipe: any, userProfile: any): string {
    const notes = [
      `This recipe is perfect for your ${userProfile.cookingSkill} skill level!`,
      `I chose this because it fits your ${userProfile.maxPrepTime} minute time limit.`,
      `This supports your ${userProfile.primaryGoal} goals beautifully.`
    ];
    
    return notes[Math.floor(Math.random() * notes.length)];
  }

  private suggestSpiceBlend(recipe: any, userProfile: any): any {
    // Match recipe to appropriate spice blend
    return {
      name: 'Turmeric + Black Pepper',
      benefit: 'Anti-inflammatory boost',
      usage: 'Add 1/2 tsp to the dish'
    };
  }

  private generateMealPlanTips(plan: any, userProfile: any): string[] {
    return [
      'Prep vegetables on Sunday for the week',
      'Cook double portions on Day 1 for easy Day 3 dinner',
      'Keep backup frozen vegetables for busy days'
    ];
  }

  private extractRecommendations(analysis: string): string[] {
    // Extract actionable recommendations
    return ['Recommendation 1', 'Recommendation 2'];
  }

  private assessEvidenceLevel(analysis: string): 'strong' | 'moderate' | 'emerging' {
    if (analysis.includes('clinical trial') || analysis.includes('meta-analysis')) {
      return 'strong';
    }
    if (analysis.includes('studies show') || analysis.includes('research suggests')) {
      return 'moderate';
    }
    return 'emerging';
  }
} 