// Viral Social Sharing & Referral Engine
// Makes sharing irresistible and rewards both parties

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ViralSharingEngine {
  // 🎯 Smart Sharing Templates
  private readonly SHARE_TEMPLATES = {
    instagram: {
      story: "Just made this amazing {recipeName} with @FlavorMonk! 🍳✨ Swipe up for recipe!",
      post: "Chef mode: ACTIVATED 👨‍🍳\n\nMade this incredible {recipeName} in just {time} minutes using @FlavorMonk!\n\n📱 Get 30% off with my code: {referralCode}\n\n#FlavorMonk #HomeCooking #FoodieLife #HealthyEating",
      reel: "POV: You discover @FlavorMonk and suddenly become a chef 🎬\n\n{recipeName} ready in {time} mins!\nUse code {referralCode} for 30% off 🎯"
    },
    twitter: {
      success: "Just crushed this {recipeName} recipe from @FlavorMonkApp! 🔥\n\nTook only {time} minutes and tastes incredible!\n\nGet 30% off with my code: {referralCode}\n\n#HomeCooking #FlavorMonk",
      achievement: "🏆 Achievement Unlocked: {achievement}!\n\nThanks @FlavorMonkApp for making me feel like a real chef!\n\nJoin me: {referralLink}"
    },
    facebook: {
      post: "Look what I made today! 😍\n\n{recipeName} from FlavorMonk - ready in just {time} minutes!\n\nIf you want to cook amazing meals without the stress, try FlavorMonk. Use my code {referralCode} for 30% off your first month!\n\n{referralLink}"
    },
    tiktok: {
      caption: "FlavorMonk turned me into a chef in {time} minutes 🤯 Use code {referralCode} for 30% off! #FlavorMonk #CookingHack #FoodTok #EasyRecipes"
    }
  };

  // 📸 One-Click Photo Sharing
  async createShareableContent(userId: string, recipeId: string, photoUrl?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    const referralCode = await this.getOrCreateReferralCode(userId);

    // Generate beautiful share card
    const shareCard = await this.generateShareCard({
      recipeName: recipe?.name || '',
      recipePhoto: photoUrl || recipe?.imageUrl || '',
      userName: user?.name || 'Chef',
      cookTime: recipe?.cookTime || 20,
      difficulty: recipe?.difficulty || 'Easy',
      referralCode: referralCode
    });

    // Pre-filled share links
    const shareLinks = {
      instagram: this.generateInstagramShareLink(shareCard, recipe, referralCode),
      twitter: this.generateTwitterShareLink(recipe, referralCode),
      facebook: this.generateFacebookShareLink(shareCard, recipe, referralCode),
      tiktok: this.generateTikTokShareLink(recipe, referralCode),
      whatsapp: this.generateWhatsAppShareLink(recipe, referralCode)
    };

    return {
      shareCard,
      shareLinks,
      templates: this.getPersonalizedTemplates(recipe, referralCode),
      referralCode
    };
  }

  // 💰 Referral System
  async processReferral(referralCode: string, newUserId: string) {
    // Find referrer
    const referrer = await prisma.user.findFirst({
      where: { referralCode }
    });

    if (!referrer) return null;

    // Create referral record
    const referral = await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: newUserId,
        status: 'PENDING',
        reward: 5.00, // $5 for referrer
        discount: 30, // 30% for new user
      }
    });

    // Send notification to referrer
    await this.notifyReferrer(referrer.id, {
      message: "🎉 Someone just used your referral code! You'll get $5 when they complete their first month!",
      referredUserName: 'New chef'
    });

    return referral;
  }

  // 🎁 Referral Rewards Structure
  private readonly REFERRAL_REWARDS = {
    firstReferral: {
      referrer: 5.00,      // $5 cash
      referred: 30,        // 30% off first month
      message: "Welcome! You get 30% off thanks to your friend!"
    },
    milestone5: {
      referrer: 25.00,     // $25 bonus at 5 referrals
      badge: 'INFLUENCER',
      message: "You're on fire! 🔥 $25 bonus unlocked!"
    },
    milestone10: {
      referrer: 50.00,     // $50 bonus at 10 referrals
      badge: 'AMBASSADOR',
      freeMonths: 2,
      message: "Ambassador status achieved! 🏆"
    },
    milestone25: {
      referrer: 150.00,    // $150 bonus at 25 referrals
      badge: 'LEGEND',
      lifetimeDiscount: 50, // 50% off forever
      message: "You're a FlavorMonk Legend! 👑"
    }
  };

  // 📱 Smart Share Widget Component
  generateShareWidget() {
    return `
import { useState } from 'react';
import { Share2, Instagram, Twitter, Facebook, Camera, Gift } from 'lucide-react';

export function SmartShareWidget({ recipe, userId, photoUrl }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareContent, setShareContent] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async (platform: string) => {
    const response = await fetch('/api/social/share', {
      method: 'POST',
      body: JSON.stringify({ userId, recipeId: recipe.id, platform, photoUrl })
    });
    
    const data = await response.json();
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(data.shareLinks[platform], '_blank');
    }
    
    // Track share for rewards
    trackShare(platform);
  };

  return (
    <>
      {/* Floating Share Button */}
      <button
        onClick={() => setShowShareMenu(true)}
        className="fixed bottom-20 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
      >
        <Share2 className="w-6 h-6" />
      </button>

      {/* Share Menu */}
      {showShareMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-md animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Share Your Creation! 🎉</h3>
              <button onClick={() => setShowShareMenu(false)}>✕</button>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <ShareButton
                icon={<Instagram />}
                label="Instagram"
                color="bg-gradient-to-br from-purple-600 to-pink-600"
                onClick={() => handleShare('instagram')}
              />
              <ShareButton
                icon={<Twitter />}
                label="Twitter"
                color="bg-blue-400"
                onClick={() => handleShare('twitter')}
              />
              <ShareButton
                icon={<Facebook />}
                label="Facebook"
                color="bg-blue-600"
                onClick={() => handleShare('facebook')}
              />
            </div>

            {/* Referral Code Display */}
            <div className="bg-purple-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Your friends get 30% off!</p>
              <div className="flex items-center justify-between">
                <code className="text-xl font-mono font-bold text-purple-600">
                  {shareContent?.referralCode}
                </code>
                <button
                  onClick={() => handleShare('copy')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm"
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">You earn $5 per friend who joins!</p>
            </div>

            {/* Pre-written Templates */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Or use a template:</p>
              {Object.entries(shareContent?.templates || {}).map(([platform, template]) => (
                <button
                  key={platform}
                  onClick={() => {
                    navigator.clipboard.writeText(template);
                    setCopied(true);
                  }}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="text-xs text-gray-500">{platform}</p>
                  <p className="text-sm line-clamp-2">{template}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
`;
  }

  // 🏃‍♂️ Quick Cancellation Flow
  generateCancellationFlow() {
    return `
import { useState } from 'react';
import { AlertCircle, Gift, DollarSign } from 'lucide-react';

export function SmartCancellationFlow({ userId, subscriptionId }) {
  const [showOffer, setShowOffer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleCancelClick = () => {
    // Check if within 48 hours
    const isWithin48Hours = checkIfWithin48Hours(subscriptionId);
    setShowOffer(true);
  };

  const handleOptionSelect = async (option: 'keep50' | 'fullRefund') => {
    setSelectedOption(option);
    
    if (option === 'keep50') {
      // Show special offer
      setShowSpecialOffer(true);
    }
  };

  const processCancellation = async () => {
    setProcessing(true);
    
    await fetch('/api/subscription/cancel', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        subscriptionId,
        option: selectedOption,
        feedback,
        within48Hours: true
      })
    });

    // Show confirmation
    setShowConfirmation(true);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {!showOffer ? (
        <button
          onClick={handleCancelClick}
          className="text-gray-500 underline text-sm"
        >
          Cancel subscription
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-bold">We're sorry to see you go! 😢</h3>
          </div>

          <p className="text-gray-600 mb-6">
            Since you're within your first 48 hours, we have two options for you:
          </p>

          {/* Option Cards */}
          <div className="space-y-4 mb-6">
            {/* Option 1: Keep 50% */}
            <div 
              onClick={() => handleOptionSelect('keep50')}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedOption === 'keep50' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <Gift className="w-6 h-6 text-purple-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Keep 50% as credit</h4>
                  <p className="text-sm text-gray-600">
                    Get 50% back as account credit + 1 month free when you're ready to return
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    Most popular choice! 🌟
                  </p>
                </div>
              </div>
            </div>

            {/* Option 2: Full Refund */}
            <div 
              onClick={() => handleOptionSelect('fullRefund')}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedOption === 'fullRefund' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 text-green-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Full refund</h4>
                  <p className="text-sm text-gray-600">
                    Get 100% of your money back, cancel immediately
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Special Offer for 50% Option */}
          {selectedOption === 'keep50' && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-purple-800">
                🎁 Special Offer: We'll also add 100 bonus points to your account!
              </p>
            </div>
          )}

          {/* Feedback Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Mind sharing why you're leaving? (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              rows={3}
              placeholder="Too expensive, not enough recipes, too complicated..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={processCancellation}
              disabled={!selectedOption || processing}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : 'Confirm Cancellation'}
            </button>
            <button
              onClick={() => setShowOffer(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Keep Subscription
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
`;
  }

  // Helper methods
  private async generateShareCard(data: any): Promise<string> {
    // In production, use Canvas API or server-side image generation
    // This returns a URL to the generated share card
    return `https://flavormonk.app/share-cards/${data.referralCode}.png`;
  }

  private getPersonalizedTemplates(recipe: any, referralCode: string): Record<string, string> {
    const templates: Record<string, string> = {};
    
    for (const [platform, templateObj] of Object.entries(this.SHARE_TEMPLATES)) {
      const template = (templateObj as any).post || (templateObj as any).success || (templateObj as any).caption;
      if (template) {
        templates[platform] = template
          .replace('{recipeName}', recipe.name)
          .replace('{time}', recipe.cookTime)
          .replace('{referralCode}', referralCode)
          .replace('{referralLink}', `https://flavormonk.app/ref/${referralCode}`);
      }
    }
    
    return templates;
  }

  private generateInstagramShareLink(shareCard: string, recipe: any, referralCode: string): string {
    // Instagram doesn't have direct share API, return instructions
    return `instagram://share?media=${encodeURIComponent(shareCard)}`;
  }

  private generateTwitterShareLink(recipe: any, referralCode: string): string {
    const text = this.SHARE_TEMPLATES.twitter.success
      .replace('{recipeName}', recipe.name)
      .replace('{time}', recipe.cookTime)
      .replace('{referralCode}', referralCode);
    
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  }

  private generateFacebookShareLink(shareCard: string, recipe: any, referralCode: string): string {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://flavormonk.app/ref/${referralCode}`)}&quote=${encodeURIComponent(this.SHARE_TEMPLATES.facebook.post)}`;
  }

  private generateTikTokShareLink(recipe: any, referralCode: string): string {
    // TikTok doesn't have direct share API
    return `https://www.tiktok.com/`;
  }

  private generateWhatsAppShareLink(recipe: any, referralCode: string): string {
    const text = `Check out this amazing ${recipe.name} recipe I made with FlavorMonk! 🍳\n\nGet 30% off with my code: ${referralCode}\n\nhttps://flavormonk.app/ref/${referralCode}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  private async getOrCreateReferralCode(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user?.referralCode) {
      return user.referralCode;
    }
    
    // Generate unique code
    const code = this.generateUniqueCode(user?.name || 'CHEF');
    
    await prisma.user.update({
      where: { id: userId },
      data: { referralCode: code }
    });
    
    return code;
  }

  private generateUniqueCode(name: string): string {
    const prefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${random}`;
  }

  private async notifyReferrer(referrerId: string, notification: any) {
    // In production, send email/push notification
    console.log(`Notifying referrer ${referrerId}:`, notification);
  }
}

// Database schema additions
export const socialSchemaAdditions = `
// Add to schema.prisma

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
  
  @@map("referrals")
}

model ShareTracking {
  id        String   @id @default(cuid())
  userId    String
  recipeId  String
  platform  String
  timestamp DateTime @default(now())
  resulted  Boolean  @default(false) // Did it result in a signup?
  
  user   User   @relation(fields: [userId], references: [id])
  recipe Recipe @relation(fields: [recipeId], references: [id])
  
  @@map("share_tracking")
}

model CancellationFeedback {
  id              String   @id @default(cuid())
  userId          String
  reason          String?
  feedback        String?
  optionSelected  String   // keep50, fullRefund
  within48Hours   Boolean
  timestamp       DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
  
  @@map("cancellation_feedback")
}
`; 