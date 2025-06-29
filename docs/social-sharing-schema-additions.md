# Social Sharing & Referral System - Database Schema

Add these models to your `schema.prisma` file:

```prisma
// User model additions
model User {
  // ... existing fields ...
  
  referralCode     String?  @unique
  points           Int      @default(0)
  accountCredit    Float    @default(0)
  
  // Relations for referrals
  referralsMade    Referral[] @relation("ReferralsMade")
  referralsReceived Referral[] @relation("ReferralsReceived")
  shareTracking    ShareTracking[]
  cancellationFeedback CancellationFeedback[]
  achievements     UserAchievement[]
}

// Referral tracking
model Referral {
  id          String   @id @default(cuid())
  referrerId  String
  referredId  String
  status      String   @default("PENDING") // PENDING, COMPLETED, CANCELLED
  reward      Float    @default(5.00)
  discount    Int      @default(30)
  completedAt DateTime?
  createdAt   DateTime @default(now())
  
  referrer User @relation("ReferralsMade", fields: [referrerId], references: [id])
  referred User @relation("ReferralsReceived", fields: [referredId], references: [id])
  
  @@index([referrerId])
  @@index([referredId])
  @@map("referrals")
}

// Social share tracking
model ShareTracking {
  id        String   @id @default(cuid())
  userId    String
  recipeId  String
  platform  String   // instagram, twitter, facebook, tiktok, whatsapp
  timestamp DateTime @default(now())
  resulted  Boolean  @default(false) // Did it result in a signup?
  referralId String? // Link to referral if someone signed up
  
  user   User   @relation(fields: [userId], references: [id])
  recipe Recipe @relation(fields: [recipeId], references: [id])
  
  @@index([userId])
  @@index([platform])
  @@map("share_tracking")
}

// Cancellation tracking
model CancellationFeedback {
  id              String   @id @default(cuid())
  userId          String
  reason          String?
  feedback        String?  @db.Text
  optionSelected  String   // keep50, fullRefund
  within48Hours   Boolean
  creditIssued    Float?   // Amount of credit given
  refundAmount    Float?   // Amount refunded
  timestamp       DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
  
  @@map("cancellation_feedback")
}

// Achievement/badge system
model UserAchievement {
  id           String   @id @default(cuid())
  userId       String
  achievement  String   // TASTE_TESTER, INFLUENCER, AMBASSADOR, LEGEND
  type         String   // REFERRAL, FEEDBACK, COOKING, SOCIAL
  grantedAt    DateTime @default(now())
  metadata     Json?    // Store additional achievement data
  
  user User @relation(fields: [userId], references: [id])
  
  @@unique([userId, achievement])
  @@index([userId])
  @@map("user_achievements")
}

// Recipe model additions
model Recipe {
  // ... existing fields ...
  
  shareTracking ShareTracking[]
  viralityScore Float? @default(0) // How often it's shared
}

// Subscription model additions for cancellation tracking
model Subscription {
  id              String   @id @default(cuid())
  userId          String
  status          String   // ACTIVE, CANCELLED, PAUSED
  startDate       DateTime
  endDate         DateTime?
  cancelledAt     DateTime?
  pausedUntil     DateTime?
  creditBalance   Float    @default(0)
  freeMonthsBank  Int      @default(0) // Free months earned
  
  user User @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@map("subscriptions")
}
```

## Migration Commands

After adding these to your schema, run:

```bash
# Generate migration
npx prisma migrate dev --name add-social-sharing-features

# Update Prisma Client
npx prisma generate
```

## Key Features Enabled

1. **Referral System**
   - Unique referral codes per user
   - Track who referred whom
   - Monitor reward status
   - Calculate payouts

2. **Share Tracking**
   - Track shares by platform
   - Link shares to signups
   - Measure virality per recipe

3. **Cancellation Management**
   - Store cancellation reasons
   - Track refund/credit amounts
   - Analyze churn patterns

4. **Gamification**
   - User points system
   - Achievement badges
   - Account credits

5. **Subscription Management**
   - Track subscription lifecycle
   - Store credit balances
   - Manage free months earned 