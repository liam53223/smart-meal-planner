import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { IntelligentQualityControl } from '@/lib/ai/intelligent-quality-control';

const prisma = new PrismaClient();
const qc = new IntelligentQualityControl();

export async function POST(request: NextRequest) {
  try {
    const { recipeId, userId, interaction } = await request.json();

    // Validate input
    if (!recipeId || !userId || !interaction) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Track the interaction
    const trackedInteraction = await prisma.recipeInteraction.create({
      data: {
        recipeId,
        userId,
        ...interaction,
        timestamp: new Date()
      }
    });

    // Run background tasks based on interaction type
    if (interaction.completed) {
      // User finished cooking - perfect time for feedback
      scheduleDetailedFeedbackRequest(userId, recipeId);
    }

    if (interaction.photoUploaded) {
      // Award points for photo upload
      await awardPoints(userId, 20, 'PHOTO_UPLOAD');
    }

    if (interaction.madeAgain) {
      // This is a strong quality signal
      await updateRecipeQualitySignal(recipeId, 'REPEAT_COOK', 1.5);
    }

    // Check if user needs storage optimization
    const storageUsage = await calculateUserStorageUsage(userId);
    if (storageUsage > 900000) { // 900KB warning threshold
      await qc.optimizeUserStorage(userId);
    }

    // Update recipe metrics in background (non-blocking)
    updateRecipeMetricsAsync(recipeId);

    return NextResponse.json({
      success: true,
      interaction: trackedInteraction.id,
      message: 'Interaction tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking interaction:', error);
    return NextResponse.json(
      { error: 'Failed to track interaction' },
      { status: 500 }
    );
  }
}

// Helper functions
async function scheduleDetailedFeedbackRequest(userId: string, recipeId: string) {
  // Schedule a notification or email to request detailed feedback
  // This could integrate with your notification system
  console.log(`Scheduling feedback request for user ${userId} on recipe ${recipeId}`);
}

async function awardPoints(userId: string, points: number, reason: string) {
  // Update user points and check for achievements
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      points: { increment: points }
    }
  });

  // Check for achievement milestones
  const feedbackCount = await prisma.feedback.count({
    where: { userId }
  });

  if (feedbackCount === 5) {
    await prisma.userAchievement.create({
      data: {
        userId,
        achievement: 'TASTE_TESTER',
        grantedAt: new Date()
      }
    });
  }
}

async function updateRecipeQualitySignal(
  recipeId: string, 
  signal: string, 
  weight: number
) {
  // Update recipe quality score based on positive signals
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId }
  });

  if (recipe) {
    const currentScore = recipe.qualityScore || 0;
    const newScore = Math.min(5, currentScore + (0.1 * weight));
    
    await prisma.recipe.update({
      where: { id: recipeId },
      data: { qualityScore: newScore }
    });
  }
}

async function calculateUserStorageUsage(userId: string): Promise<number> {
  // Calculate approximate storage usage for the user
  const counts = await Promise.all([
    prisma.mealPlan.count({ where: { userId } }),
    prisma.shoppingList.count({ where: { userId } }),
    prisma.feedback.count({ where: { userId } }),
    prisma.recipeInteraction.count({ where: { userId } })
  ]);

  // Rough estimates: mealPlan ~5KB, shoppingList ~3KB, feedback ~1KB, interaction ~0.5KB
  return (counts[0] * 5000) + (counts[1] * 3000) + (counts[2] * 1000) + (counts[3] * 500);
}

function updateRecipeMetricsAsync(recipeId: string) {
  // Run this in background without blocking the response
  setTimeout(async () => {
    try {
      // Calculate new completion rate
      const started = await prisma.recipeInteraction.count({
        where: { recipeId, started: true }
      });
      
      const completed = await prisma.recipeInteraction.count({
        where: { recipeId, completed: true }
      });
      
      const completionRate = started > 0 ? completed / started : 0;

      // Update recipe metrics
      await prisma.recipe.update({
        where: { id: recipeId },
        data: {
          completionRate,
          lastReviewed: new Date()
        }
      });

      // Check if recipe needs to be flagged
      if (completionRate < 0.5 && started > 20) {
        await prisma.recipe.update({
          where: { id: recipeId },
          data: { flaggedForReview: true }
        });
      }
    } catch (error) {
      console.error('Error updating recipe metrics:', error);
    }
  }, 0);
} 