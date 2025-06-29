import { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, Camera, ChefHat } from 'lucide-react';

interface SmartFeedbackWidgetProps {
  recipeId: string;
  userId: string;
}

export function SmartFeedbackWidget({ recipeId, userId }: SmartFeedbackWidgetProps) {
  const [showQuickFeedback, setShowQuickFeedback] = useState(false);
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState({
    difficulty: '',
    timing: '',
    portions: '',
    wouldMakeAgain: false,
    notes: ''
  });

  // Show feedback prompt at optimal time (5 minutes after viewing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowQuickFeedback(true);
    }, 300000); // 5 minutes
    
    // Track that user viewed the recipe
    trackInteraction('viewed');
    
    return () => clearTimeout(timer);
  }, []);

  const trackInteraction = async (action: string) => {
    await fetch('/api/feedback/interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        recipeId, 
        userId, 
        interaction: { [action]: true }
      })
    });
  };

  const handleQuickFeedback = async (action: string) => {
    if (action === 'made_it') {
      setShowQuickFeedback(false);
      setShowDetailedFeedback(true);
      trackInteraction('started');
    } else if (action === 'saved') {
      trackInteraction('saved');
      setShowQuickFeedback(false);
      // Show success message
      showToast('Recipe saved! We\'ll remind you later.');
    } else {
      setShowQuickFeedback(false);
    }
  };

  const handleDetailedSubmit = async () => {
    await fetch('/api/feedback/detailed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipeId,
        userId,
        rating,
        ...feedback,
        photoUploaded
      })
    });
    
    trackInteraction('completed');
    if (feedback.wouldMakeAgain) {
      trackInteraction('madeAgain');
    }
    
    setShowDetailedFeedback(false);
    showToast('Thanks for your feedback! You earned 10 points! 🎉');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle photo upload
      setPhotoUploaded(true);
      trackInteraction('photoUploaded');
    }
  };

  const showToast = (message: string) => {
    // Implementation would show a toast notification
    console.log(message);
  };

  return (
    <>
      {/* Quick Feedback Popup */}
      {showQuickFeedback && (
        <div className="fixed bottom-4 right-4 bg-white shadow-2xl rounded-xl p-4 animate-slide-up max-w-sm">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-5 h-5 text-orange-500" />
            <p className="text-sm font-medium">Did you make this recipe?</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleQuickFeedback('made_it')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Yes! 👨‍🍳
            </button>
            <button 
              onClick={() => handleQuickFeedback('saved')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              Saved 📌
            </button>
            <button 
              onClick={() => handleQuickFeedback('skip')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Not yet
            </button>
          </div>
        </div>
      )}

      {/* Detailed Feedback Modal */}
      {showDetailedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">How was your cooking experience?</h3>
            
            {/* Star Rating */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Overall rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-colors ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Feedback Options */}
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">How was the difficulty?</p>
                <div className="flex gap-2">
                  {['Easier', 'As expected', 'Harder'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFeedback({ ...feedback, difficulty: option })}
                      className={`px-3 py-1 rounded-full text-sm ${
                        feedback.difficulty === option
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">How was the timing?</p>
                <div className="flex gap-2">
                  {['Quicker', 'Accurate', 'Took longer'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFeedback({ ...feedback, timing: option })}
                      className={`px-3 py-1 rounded-full text-sm ${
                        feedback.timing === option
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Were the portions right?</p>
                <div className="flex gap-2">
                  {['Too small', 'Just right', 'Too large'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFeedback({ ...feedback, portions: option })}
                      className={`px-3 py-1 rounded-full text-sm ${
                        feedback.portions === option
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={feedback.wouldMakeAgain}
                  onChange={(e) => setFeedback({ ...feedback, wouldMakeAgain: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm">I would make this again</label>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">
                Share a photo (earn bonus points!)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {photoUploaded && (
                <p className="text-sm text-green-600 mt-1">Photo uploaded! +5 points 📸</p>
              )}
            </div>

            {/* Additional Notes */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">
                Any other feedback? (optional)
              </label>
              <textarea
                value={feedback.notes}
                onChange={(e) => setFeedback({ ...feedback, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                rows={3}
                placeholder="E.g., 'I added extra garlic and it was perfect!'"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleDetailedSubmit}
                disabled={rating === 0}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setShowDetailedFeedback(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 