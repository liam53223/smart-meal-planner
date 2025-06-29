// Intelligent Quality Control & Optimization System
// Prevents bad recipes, optimizes storage, and continuously improves

import { PrismaClient } from '@prisma/client';
import { ChromaClient } from 'chromadb';

const prisma = new PrismaClient();

export class IntelligentQualityControl {
  private readonly QUALITY_THRESHOLDS = {
    minRating: 3.5,              // Remove recipes below this
    minFeedbackCount: 10,        // Need this many ratings before evaluation
    maxComplaintRatio: 0.3,      // Remove if 30%+ users complain
    minCompletionRate: 0.5,      // Remove if <50% actually cook it
    maxStoragePerUser: 1024000,  // 1MB max per user
    recipeRetentionDays: 180,    // Archive unused recipes after 6 months
  };

  // 🎯 Recipe Quality Scoring System
  async calculateRecipeQualityScore(recipeId: string): Promise<number> {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        feedbacks: true,
        nutritionalInfo: true
      }
    });

    if (!recipe) return 0;

    // Multi-factor quality scoring
    const scores = {
      // User satisfaction (40% weight)
      userRating: this.calculateAverageRating(recipe.feedbacks) * 0.4,
      
      // Nutritional value (20% weight)
      nutritionScore: this.calculateNutritionScore(recipe.nutritionalInfo) * 0.2,
      
      // Preparation success rate (20% weight)
      completionRate: await this.calculateCompletionRate(recipeId) * 0.2,
      
      // Ingredient availability (10% weight)
      ingredientScore: await this.calculateIngredientAvailability(recipe) * 0.1,
      
      // Repeat cooking rate (10% weight)
      repeatRate: await this.calculateRepeatCookingRate(recipeId) * 0.1
    };

    return Object.values(scores).reduce((sum, score) => sum + score, 0);
  }

  // 📊 Continuous Feedback Collection
  async collectMicroFeedback(userId: string, recipeId: string, interaction: {
    viewed?: boolean;
    saved?: boolean;
    started?: boolean;
    completed?: boolean;
    photoUploaded?: boolean;
    sharedWithFriends?: boolean;
    madeAgain?: boolean;
  }) {
    // Track every micro-interaction
    await prisma.recipeInteraction.create({
      data: {
        userId,
        recipeId,
        ...interaction,
        timestamp: new Date()
      }
    });

    // Update recipe popularity score in real-time
    await this.updateRecipePopularity(recipeId);
  }

  // 🧹 Intelligent Storage Optimization
  async optimizeUserStorage(userId: string) {
    // Get user's storage usage
    const usage = await this.calculateUserStorageUsage(userId);
    
    if (usage > this.QUALITY_THRESHOLDS.maxStoragePerUser) {
      // Intelligent cleanup strategies
      await this.archiveOldMealPlans(userId);
      await this.compressUserPreferences(userId);
      await this.removeUnusedRecipeCache(userId);
      await this.consolidateDuplicateFeedback(userId);
    }
  }

  // 🎨 Smart Recipe Pruning
  async pruneDatabase() {
    console.log('🧹 Starting intelligent database pruning...');
    
    // 1. Remove consistently poor recipes
    const poorRecipes = await prisma.recipe.findMany({
      where: {
        feedbacks: {
          some: {}
        }
      },
      include: {
        feedbacks: true
      }
    });

    for (const recipe of poorRecipes) {
      const avgRating = this.calculateAverageRating(recipe.feedbacks);
      const feedbackCount = recipe.feedbacks.length;
      
      if (feedbackCount >= this.QUALITY_THRESHOLDS.minFeedbackCount && 
          avgRating < this.QUALITY_THRESHOLDS.minRating) {
        await this.archiveRecipe(recipe.id, 'LOW_RATING');
      }
    }

    // 2. Archive unused recipes
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(sixMonthsAgo.getDate() - this.QUALITY_THRESHOLDS.recipeRetentionDays);
    
    const unusedRecipes = await prisma.recipe.findMany({
      where: {
        feedbacks: {
          none: {
            timestamp: {
              gte: sixMonthsAgo
            }
          }
        }
      }
    });

    for (const recipe of unusedRecipes) {
      await this.archiveRecipe(recipe.id, 'UNUSED');
    }

    // 3. Optimize similar recipes
    await this.consolidateSimilarRecipes();
  }

  // 🤖 Intelligent Recipe Improvement
  async improveRecipe(recipeId: string): Promise<any> {
    const feedback = await prisma.feedback.findMany({
      where: { recipeId },
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    // Analyze common complaints
    const issues = this.analyzeFeedbackPatterns(feedback);
    
    // Generate improvements
    const improvements = {
      ingredients: issues.ingredients.map(issue => ({
        original: issue.ingredient,
        suggestion: this.suggestIngredientReplacement(issue)
      })),
      
      instructions: issues.instructions.map(issue => ({
        step: issue.step,
        clarification: this.generateClarification(issue)
      })),
      
      timing: issues.timing ? {
        current: issues.timing.reported,
        suggested: issues.timing.average,
        tip: 'Users report this takes longer than stated'
      } : null,
      
      servings: issues.portions ? {
        current: issues.portions.stated,
        actual: issues.portions.reported,
        adjustment: issues.portions.reported / issues.portions.stated
      } : null
    };

    // Auto-update recipe if confidence is high
    if (this.shouldAutoUpdate(issues)) {
      await this.applyRecipeImprovements(recipeId, improvements);
    }

    return improvements;
  }

  // 📈 Real-time Quality Monitoring
  async monitorRecipeQuality() {
    // Set up real-time monitoring
    setInterval(async () => {
      // Check trending complaints
      const recentComplaints = await this.getRecentComplaints(24); // Last 24 hours
      
      for (const complaint of recentComplaints) {
        if (complaint.count > 5) {
          // Flag recipe for review
          await this.flagRecipeForReview(complaint.recipeId, complaint.reason);
        }
      }
      
      // Check for quality improvements
      const improvedRecipes = await this.getRecentlyImprovedRecipes();
      for (const recipe of improvedRecipes) {
        await this.promoteRecipe(recipe.id);
      }
    }, 3600000); // Every hour
  }

  // 🎁 Gamified Feedback System
  async createFeedbackIncentives(userId: string) {
    const feedbackCount = await prisma.feedback.count({
      where: { userId }
    });

    // Milestone rewards
    const milestones = {
      5: 'Taste Tester',
      25: 'Recipe Reviewer',
      50: 'Culinary Critic',
      100: 'Master Chef'
    };

    const achievement = milestones[feedbackCount as keyof typeof milestones];
    if (achievement) {
      await this.grantAchievement(userId, achievement);
    }

    // Quality feedback rewards
    const qualityScore = await this.calculateFeedbackQuality(userId);
    if (qualityScore > 0.8) {
      await this.grantBadge(userId, 'QUALITY_CONTRIBUTOR');
    }
  }

  // 🔄 Continuous Learning Pipeline
  async runDailyOptimization() {
    console.log('🔄 Running daily optimization...');
    
    // 1. Prune poor recipes
    await this.pruneDatabase();
    
    // 2. Optimize storage for all users
    const users = await prisma.user.findMany();
    for (const user of users) {
      await this.optimizeUserStorage(user.id);
    }
    
    // 3. Update recipe quality scores
    const recipes = await prisma.recipe.findMany();
    for (const recipe of recipes) {
      const score = await this.calculateRecipeQualityScore(recipe.id);
      await prisma.recipe.update({
        where: { id: recipe.id },
        data: { qualityScore: score }
      });
    }
    
    // 4. Generate quality report
    const report = await this.generateQualityReport();
    await this.notifyAdmins(report);
  }

  // Helper methods
  private calculateAverageRating(feedbacks: any[]): number {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    return sum / feedbacks.length;
  }

  private calculateNutritionScore(nutrition: any): number {
    if (!nutrition) return 0.5;
    
    // Balanced nutrition scoring
    let score = 1.0;
    
    // Penalize extreme values
    if (nutrition.calories > 800) score -= 0.1;
    if (nutrition.sodium > 1000) score -= 0.2;
    if (nutrition.sugar > 20) score -= 0.1;
    
    // Reward good nutrition
    if (nutrition.fiber > 5) score += 0.1;
    if (nutrition.protein > 20) score += 0.1;
    
    return Math.max(0, Math.min(1, score));
  }

  private async calculateCompletionRate(recipeId: string): Promise<number> {
    const started = await prisma.recipeInteraction.count({
      where: { recipeId, started: true }
    });
    
    const completed = await prisma.recipeInteraction.count({
      where: { recipeId, completed: true }
    });
    
    return started > 0 ? completed / started : 0;
  }

  private async archiveRecipe(recipeId: string, reason: string) {
    // Move to archive table instead of deleting
    await prisma.archivedRecipe.create({
      data: {
        originalId: recipeId,
        reason,
        archivedAt: new Date(),
        recipeData: await prisma.recipe.findUnique({
          where: { id: recipeId },
          include: { ingredients: true, instructions: true }
        })
      }
    });
    
    // Remove from active recipes
    await prisma.recipe.delete({ where: { id: recipeId } });
  }

  private analyzeFeedbackPatterns(feedbacks: any[]) {
    const patterns = {
      ingredients: [] as any[],
      instructions: [] as any[],
      timing: null as any,
      portions: null as any
    };
    
    // Analyze feedback notes for common issues
    feedbacks.forEach(f => {
      if (f.notes) {
        // Extract patterns using simple keyword matching
        // In production, use NLP
        if (f.notes.includes('too spicy')) {
          patterns.ingredients.push({ ingredient: 'spice', issue: 'too much' });
        }
        if (f.notes.includes('took longer')) {
          patterns.timing = { reported: 'longer', average: 1.3 };
        }
      }
    });
    
    return patterns;
  }
}

// Feedback Widget Component
export const FeedbackWidget = `
import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, Camera } from 'lucide-react';

export function SmartFeedbackWidget({ recipeId, userId }) {
  const [showQuickFeedback, setShowQuickFeedback] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  
  // Show feedback prompt at optimal time
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowQuickFeedback(true);
    }, 300000); // 5 minutes after viewing
    
    return () => clearTimeout(timer);
  }, []);

  const handleQuickFeedback = async (action: string) => {
    await fetch('/api/feedback/quick', {
      method: 'POST',
      body: JSON.stringify({ recipeId, userId, action })
    });
    
    if (action === 'made_it') {
      // Show detailed feedback form
      setShowDetailedFeedback(true);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      {showQuickFeedback && (
        <div className="bg-white shadow-lg rounded-lg p-4 animate-slide-up">
          <p className="text-sm mb-2">Did you make this recipe?</p>
          <div className="flex gap-2">
            <button 
              onClick={() => handleQuickFeedback('made_it')}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Yes! 👨‍🍳
            </button>
            <button 
              onClick={() => handleQuickFeedback('saved')}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Saved 📌
            </button>
            <button 
              onClick={() => handleQuickFeedback('skip')}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Not yet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
`;

// Database schema additions
export const schemaAdditions = `
// Add to schema.prisma

model RecipeInteraction {
  id              String   @id @default(cuid())
  userId          String
  recipeId        String
  viewed          Boolean  @default(false)
  saved           Boolean  @default(false)
  started         Boolean  @default(false)
  completed       Boolean  @default(false)
  photoUploaded   Boolean  @default(false)
  sharedWithFriends Boolean @default(false)
  madeAgain       Boolean  @default(false)
  timestamp       DateTime @default(now())
  
  user   User   @relation(fields: [userId], references: [id])
  recipe Recipe @relation(fields: [recipeId], references: [id])
  
  @@index([userId, recipeId])
  @@map("recipe_interactions")
}

model ArchivedRecipe {
  id         String   @id @default(cuid())
  originalId String
  reason     String
  archivedAt DateTime
  recipeData Json
  
  @@map("archived_recipes")
}

model UserAchievement {
  id           String   @id @default(cuid())
  userId       String
  achievement  String
  grantedAt    DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
  
  @@map("user_achievements")
}
`; 