import { useState, useEffect } from 'react';
import { Share2, Instagram, Twitter, Facebook, MessageCircle, Link, Camera } from 'lucide-react';

interface SmartShareWidgetProps {
  recipe: {
    id: string;
    name: string;
    cookTime: number;
    imageUrl?: string;
  };
  userId: string;
  photoUrl?: string;
}

interface ShareContent {
  shareCard: string;
  shareLinks: Record<string, string>;
  templates: Record<string, string>;
  referralCode: string;
}

export function SmartShareWidget({ recipe, userId, photoUrl }: SmartShareWidgetProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareContent, setShareContent] = useState<ShareContent | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showShareMenu && !shareContent) {
      fetchShareContent();
    }
  }, [showShareMenu]);

  const fetchShareContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/social/share-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, recipeId: recipe.id, photoUrl })
      });
      
      const data = await response.json();
      setShareContent(data);
    } catch (error) {
      console.error('Error fetching share content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (platform: string) => {
    if (!shareContent) return;

    // Track the share
    await fetch('/api/social/track-share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, recipeId: recipe.id, platform })
    });

    if (platform === 'copy') {
      const referralLink = `https://flavormonk.app/ref/${shareContent.referralCode}`;
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (platform === 'copyTemplate') {
      // Copy the first template
      const firstTemplate = Object.values(shareContent.templates)[0];
      navigator.clipboard.writeText(firstTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareContent.shareLinks[platform], '_blank');
    }
  };

  const ShareButton = ({ 
    icon, 
    label, 
    color, 
    onClick 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    color: string; 
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl ${color} text-white hover:scale-105 transition-transform`}
    >
      <div className="w-8 h-8 mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <>
      {/* Floating Share Button */}
      <button
        onClick={() => setShowShareMenu(true)}
        className="fixed bottom-20 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform z-40"
        aria-label="Share recipe"
      >
        <Share2 className="w-6 h-6" />
      </button>

      {/* Share Menu Modal */}
      {showShareMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-md animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold">Share Your Creation! 🎉</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Inspire others and earn rewards
                </p>
              </div>
              <button 
                onClick={() => setShowShareMenu(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : shareContent ? (
              <>
                {/* Recipe Preview */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center gap-3">
                  {(photoUrl || recipe.imageUrl) && (
                    <img 
                      src={photoUrl || recipe.imageUrl} 
                      alt={recipe.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{recipe.name}</p>
                    <p className="text-sm text-gray-600">Ready in {recipe.cookTime} mins</p>
                  </div>
                </div>

                {/* Quick Share Buttons */}
                <div className="grid grid-cols-3 gap-3 mb-6">
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
                  <ShareButton
                    icon={<MessageCircle />}
                    label="WhatsApp"
                    color="bg-green-500"
                    onClick={() => handleShare('whatsapp')}
                  />
                  <ShareButton
                    icon={<Camera />}
                    label="TikTok"
                    color="bg-black"
                    onClick={() => handleShare('tiktok')}
                  />
                  <ShareButton
                    icon={<Link />}
                    label="Copy Link"
                    color="bg-gray-500"
                    onClick={() => handleShare('copy')}
                  />
                </div>

                {/* Referral Code Display */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">Your Referral Code</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      $5 per friend
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-2xl font-mono font-bold text-purple-600">
                      {shareContent.referralCode}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareContent.referralCode);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                    >
                      {copied ? '✓ Copied!' : 'Copy Code'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Your friends get 30% off their first month!
                  </p>
                </div>

                {/* Pre-written Template */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Or copy this message:
                  </p>
                  <p className="text-sm text-gray-600 mb-3 italic">
                    "{Object.values(shareContent.templates)[0]?.substring(0, 100)}..."
                  </p>
                  <button
                    onClick={() => handleShare('copyTemplate')}
                    className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                  >
                    Copy Full Message
                  </button>
                </div>

                {/* Referral Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-around text-center">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">0</p>
                    <p className="text-xs text-gray-600">Referrals</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">$0</p>
                    <p className="text-xs text-gray-600">Earned</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                    <p className="text-xs text-gray-600">Shares</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Unable to load share content. Please try again.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
} 