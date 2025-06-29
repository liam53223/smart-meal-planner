// Simple Feedback System - Start Here!
// This gives you 80% of fine-tuning benefits with minimal complexity

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Track Recipe Ratings (Day 1)
export async function trackRecipeFeedback(
  userId: string,
  recipeId: string,
  rating: number,
  notes?: string
) {
  // Store feedback
  const feedback = await prisma.feedback.create({
    data: {
      userId,
      recipeId,
      rating,
      notes,
      timestamp: new Date()
    }
  });

  // If highly rated, save for future reference
  if (rating >= 4) {
    await updateUserPreferences(userId, recipeId, rating);
  }

  return feedback;
}

// 2. Learn User Preferences (Day 2-3)
async function updateUserPreferences(
  userId: string,
  recipeId: string,
  rating: number
) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId }
  });

  if (!recipe) return;

  // Get or create user preferences
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  const preferences = JSON.parse(user?.preferencesJson || '{}');

  // Track ingredient preferences
  const ingredients = JSON.parse(recipe.ingredients || '[]');
  ingredients.forEach((ing: any) => {
    if (!preferences.ingredients) preferences.ingredients = {};
    
    // Positive feedback increases score
    if (rating >= 4) {
      preferences.ingredients[ing.name] = 
        (preferences.ingredients[ing.name] || 0) + (rating - 3);
    }
    // Negative feedback decreases score
    else if (rating <= 2) {
      preferences.ingredients[ing.name] = 
        (preferences.ingredients[ing.name] || 0) - 1;
    }
  });

  // Track appliance success
  if (recipe.appliances && rating >= 4) {
    if (!preferences.successfulAppliances) preferences.successfulAppliances = {};
    
    JSON.parse(recipe.appliances).forEach((appliance: string) => {
      preferences.successfulAppliances[appliance] = 
        (preferences.successfulAppliances[appliance] || 0) + 1;
    });
  }

  // Save updated preferences
  await prisma.user.update({
    where: { id: userId },
    data: { preferencesJson: JSON.stringify(preferences) }
  });
}

// 3. Enhance Prompts with History (Day 4-5)
export async function enhancePromptWithHistory(
  userId: string,
  basePrompt: string
): Promise<string> {
  // Get user's top-rated recipes
  const topRecipes = await prisma.feedback.findMany({
    where: {
      userId,
      rating: { gte: 4 }
    },
    include: { recipe: true },
    orderBy: { rating: 'desc' },
    take: 3
  });

  // Get user preferences
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  const preferences = JSON.parse(user?.preferencesJson || '{}');

  // Build enhanced prompt
  let enhancedPrompt = basePrompt;

  // Add favorite ingredients
  if (preferences.ingredients) {
    const favorites = Object.entries(preferences.ingredients as Record<string, number>)
      .filter(([_, score]) => score > 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ing]) => ing);

    if (favorites.length > 0) {
      enhancedPrompt += `\n\nUser loves these ingredients: ${favorites.join(', ')}`;
    }

    const dislikes = Object.entries(preferences.ingredients as Record<string, number>)
      .filter(([_, score]) => score < -1)
      .map(([ing]) => ing);

    if (dislikes.length > 0) {
      enhancedPrompt += `\nAvoid these ingredients: ${dislikes.join(', ')}`;
    }
  }

  // Add successful recipe examples
  if (topRecipes.length > 0) {
    enhancedPrompt += `\n\nRecipes this user loved:`;
    topRecipes.forEach((feedback: any) => {
      enhancedPrompt += `\n- ${feedback.recipe.name} (${feedback.rating}/5 stars)`;
    });
  }

  return enhancedPrompt;
}

// 4. Find Similar Successful Recipes (Day 6-7)
export async function findSimilarSuccesses(
  userId: string,
  currentIngredients: string[]
): Promise<any[]> {
  // Simple similarity: find recipes with overlapping ingredients
  const userFeedback = await prisma.feedback.findMany({
    where: {
      userId,
      rating: { gte: 4 }
    },
    include: { recipe: true }
  });

  const similarRecipes = userFeedback
    .map((feedback: any) => {
      const recipeIngredients = JSON.parse(feedback.recipe.ingredients || '[]')
        .map((ing: any) => ing.name.toLowerCase());
      
      const overlap = currentIngredients.filter(ing => 
        recipeIngredients.includes(ing.toLowerCase())
      ).length;

      return {
        recipe: feedback.recipe,
        rating: feedback.rating,
        similarity: overlap / Math.max(currentIngredients.length, recipeIngredients.length)
      };
    })
    .filter((item: any) => item.similarity > 0.3)
    .sort((a: any, b: any) => b.similarity - a.similarity)
    .slice(0, 3);

  return similarRecipes;
}

// 5. Simple A/B Testing (Week 2)
export async function runSimpleABTest(
  userId: string,
  feature: string
): Promise<'A' | 'B'> {
  // Simple hash-based assignment
  const hash = userId.split('').reduce((acc, char) => 
    acc + char.charCodeAt(0), 0
  );
  
  const variant = hash % 2 === 0 ? 'A' : 'B';

  // Track assignment
  await prisma.abTest.create({
    data: {
      userId,
      feature,
      variant,
      timestamp: new Date()
    }
  });

  return variant;
}

// Usage Example:
/*
// In your API route:
const enhancedPrompt = await enhancePromptWithHistory(userId, userQuery);
const response = await callLLM(enhancedPrompt);

// After user rates the recipe:
await trackRecipeFeedback(userId, recipeId, rating);

// For A/B testing new features:
const variant = await runSimpleABTest(userId, 'smart_suggestions');
if (variant === 'B') {
  // Show new smart suggestions feature
}
*/ 