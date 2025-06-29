# 🚀 Quality Control Implementation Guide

## Quick Start: Making Your App Intelligent & Efficient

### 1. **Database Schema Updates**
First, update your Prisma schema with the new models:

```prisma
// Add to schema.prisma
model Recipe {
  // ... existing fields ...
  qualityScore    Float?   @default(0)
  lastReviewed    DateTime?
  flaggedForReview Boolean @default(false)
  
  interactions RecipeInteraction[]
}

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
}
```

### 2. **Add Feedback Collection**
Integrate the feedback widget into your recipe pages:

```tsx
// In your recipe display page
import { SmartFeedbackWidget } from '@/components/SmartFeedbackWidget';

export function RecipePage({ recipe, userId }) {
  return (
    <div>
      {/* Your recipe content */}
      
      {/* Add the feedback widget */}
      <SmartFeedbackWidget 
        recipeId={recipe.id} 
        userId={userId} 
      />
    </div>
  );
}
```

### 3. **Create API Endpoints**
Set up the feedback tracking endpoints:

```typescript
// app/api/feedback/interaction/route.ts
export async function POST(request: Request) {
  const { recipeId, userId, interaction } = await request.json();
  
  // Track the interaction
  await prisma.recipeInteraction.create({
    data: {
      recipeId,
      userId,
      ...interaction
    }
  });
  
  // Update recipe popularity in background
  updateRecipePopularity(recipeId);
  
  return Response.json({ success: true });
}
```

### 4. **Set Up Quality Monitoring**
Create a cron job or scheduled function:

```typescript
// app/api/cron/quality-check/route.ts
import { IntelligentQualityControl } from '@/lib/ai/intelligent-quality-control';

export async function GET() {
  const qc = new IntelligentQualityControl();
  
  // Run daily optimization
  await qc.runDailyOptimization();
  
  return Response.json({ 
    message: 'Quality check completed',
    timestamp: new Date()
  });
}
```

### 5. **Implement Storage Optimization**
Add middleware to check user storage:

```typescript
// middleware.ts
export async function middleware(request: Request) {
  if (request.nextUrl.pathname.startsWith('/api/user')) {
    const userId = getUserIdFromRequest(request);
    
    // Check and optimize storage periodically
    if (shouldCheckStorage(userId)) {
      await optimizeUserStorage(userId);
    }
  }
}
```

## 📊 Key Implementation Points

### Recipe Quality Scoring Algorithm
```typescript
function calculateQualityScore(recipe) {
  const weights = {
    userRating: 0.4,      // 40% - Most important
    nutritionScore: 0.2,  // 20% - Health matters
    completionRate: 0.2,  // 20% - Actually cookable
    ingredientScore: 0.1, // 10% - Accessible ingredients
    repeatRate: 0.1       // 10% - People make it again
  };
  
  return Object.entries(weights).reduce((total, [metric, weight]) => {
    return total + (recipe[metric] * weight);
  }, 0);
}
```

### Automatic Recipe Pruning Rules
```typescript
const PRUNE_RULES = {
  // Remove if ALL conditions are met:
  lowRating: {
    minFeedbacks: 10,
    maxRating: 3.5,
    action: 'archive'
  },
  
  // Remove if unused for 6 months
  unused: {
    daysSinceLastUse: 180,
    action: 'archive'
  },
  
  // Flag for review if completion rate is low
  lowCompletion: {
    minAttempts: 20,
    maxCompletionRate: 0.5,
    action: 'flag'
  }
};
```

### Feedback Incentive System
```typescript
const REWARDS = {
  firstFeedback: { points: 50, badge: '🌟 First Timer' },
  photoUpload: { points: 20, badge: '📸 Photographer' },
  detailedNotes: { points: 15, badge: '✍️ Reviewer' },
  
  milestones: {
    5: { points: 100, badge: '🍴 Taste Tester' },
    25: { points: 500, badge: '⭐ Recipe Reviewer' },
    50: { points: 1000, badge: '👨‍🍳 Culinary Critic' },
    100: { points: 2000, badge: '🏆 Master Chef' }
  }
};
```

## 🎯 Best Practices

### 1. **Non-Intrusive Feedback**
- Wait 5 minutes before showing popup
- One-click responses
- Optional detailed feedback
- Remember user preferences

### 2. **Smart Timing**
- Track micro-interactions silently
- Ask for feedback at natural moments
- Don't interrupt the cooking process
- Remind later if they saved but didn't cook

### 3. **Gradual Rollout**
- Start with quality scoring only
- Add pruning after 1 month of data
- Implement auto-improvements after 3 months
- Monitor metrics closely

### 4. **User Communication**
- Show quality badges on recipes
- Explain why recipes were removed
- Celebrate user achievements
- Share improvement stats

## 📈 Monitoring Dashboard

Create a simple admin dashboard to track:

```typescript
// Key metrics to display
const DASHBOARD_METRICS = {
  averageRecipeRating: 'SELECT AVG(rating) FROM feedback',
  feedbackSubmissionRate: 'COUNT(feedback) / COUNT(views)',
  recipeCompletionRate: 'COUNT(completed) / COUNT(started)',
  storagePerUser: 'SELECT AVG(storage_used) FROM users',
  activeRecipeCount: 'SELECT COUNT(*) FROM recipes WHERE active = true',
  monthlyPruneCount: 'SELECT COUNT(*) FROM archived_recipes WHERE month = ?'
};
```

## 🔧 Troubleshooting

### Common Issues:

1. **Too Many Recipes Being Pruned**
   - Increase feedback threshold (10 → 20)
   - Lower quality threshold (3.5 → 3.0)
   - Add grace period for new recipes

2. **Storage Growing Too Fast**
   - Compress old meal plans
   - Limit recipe cache per user
   - Archive completed shopping lists

3. **Low Feedback Rate**
   - Increase incentive rewards
   - Simplify feedback form
   - Add more gamification

## 🎉 Expected Results

After implementing this system:

Week 1-2: Baseline data collection
Week 3-4: First pruning cycle, quality improvements visible
Month 2: 20% reduction in storage, 15% increase in ratings
Month 3: 40% reduction in bad recipes, 30% more feedback
Month 6: Stable, high-quality recipe bank with engaged users

The key is starting simple and iterating based on real user data! 🚀 