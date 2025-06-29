import { useState } from 'react';
import { AlertCircle, Gift, DollarSign, Clock, ArrowLeft } from 'lucide-react';

interface SmartCancellationFlowProps {
  userId: string;
  subscriptionId: string;
  subscriptionStartDate: Date;
}

export function SmartCancellationFlow({ 
  userId, 
  subscriptionId, 
  subscriptionStartDate 
}: SmartCancellationFlowProps) {
  const [showOffer, setShowOffer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'keep50' | 'fullRefund' | null>(null);
  const [feedback, setFeedback] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isWithin48Hours = () => {
    const hoursSinceStart = (Date.now() - new Date(subscriptionStartDate).getTime()) / (1000 * 60 * 60);
    return hoursSinceStart <= 48;
  };

  const cancellationReasons = [
    "Too expensive",
    "Not enough recipes",
    "Too complicated",
    "Found alternative",
    "Didn't use it enough",
    "Other"
  ];

  const handleCancelClick = () => {
    setShowOffer(true);
  };

  const handleOptionSelect = (option: 'keep50' | 'fullRefund') => {
    setSelectedOption(option);
  };

  const processCancellation = async () => {
    setProcessing(true);
    
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          subscriptionId,
          option: selectedOption,
          feedback: feedback || selectedReason,
          within48Hours: isWithin48Hours()
        })
      });

      if (response.ok) {
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error('Error processing cancellation:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            ✓
          </div>
          <h3 className="text-xl font-bold mb-2">Cancellation Processed</h3>
          {selectedOption === 'keep50' ? (
            <>
              <p className="text-gray-600 mb-4">
                We've added 50% credit to your account plus 100 bonus points! 
                You also have 1 free month waiting when you're ready to return.
              </p>
              <p className="text-sm text-purple-600 font-medium">
                Credit: ${(4.99 * 0.5).toFixed(2)} | Points: 100 | Free month: Ready when you are!
              </p>
            </>
          ) : (
            <p className="text-gray-600 mb-4">
              Your full refund will be processed within 24 hours. 
              We're sorry to see you go!
            </p>
          )}
          <p className="text-sm text-gray-500 mt-6">
            Changed your mind? Contact support@flavormonk.app
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      {!showOffer ? (
        <button
          onClick={handleCancelClick}
          className="text-gray-500 underline text-sm hover:text-gray-700"
        >
          Cancel subscription
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setShowOffer(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 flex-1">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-bold">We're sorry to see you go! 😢</h3>
            </div>
          </div>

          {/* 48-hour badge */}
          {isWithin48Hours() && (
            <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                You're within your 48-hour risk-free period
              </span>
            </div>
          )}

          <p className="text-gray-600 mb-6">
            {isWithin48Hours() 
              ? "Since you're within your first 48 hours, we have two special options for you:"
              : "Before you go, we'd love to offer you something special:"}
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
                <div className="bg-purple-100 rounded-lg p-2">
                  <Gift className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">Keep 50% as credit</h4>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      Most popular!
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Get 50% back as account credit for future use
                  </p>
                  <div className="bg-purple-100 rounded-lg p-2 text-xs text-purple-700">
                    <span className="font-medium">Bonus:</span> 100 points + 1 free month when you return!
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2: Full Refund */}
            {isWithin48Hours() && (
              <div 
                onClick={() => handleOptionSelect('fullRefund')}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedOption === 'fullRefund' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-lg p-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Full refund</h4>
                    <p className="text-sm text-gray-600">
                      Get 100% of your money back, no questions asked
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Processed within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Special Offer Animation for 50% Option */}
          {selectedOption === 'keep50' && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-4 animate-fade-in">
              <p className="text-sm font-medium text-purple-800">
                🎁 Special Offer Unlocked: We'll also give you access to our premium recipe collection!
              </p>
            </div>
          )}

          {/* Feedback Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Mind sharing why you're leaving? (optional)
            </label>
            
            {/* Quick reason buttons */}
            <div className="flex flex-wrap gap-2 mb-3">
              {cancellationReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedReason === reason
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
              rows={3}
              placeholder="Any specific feedback? This helps us improve..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={processCancellation}
              disabled={!selectedOption || processing}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                'Confirm Cancellation'
              )}
            </button>
            <button
              onClick={() => setShowOffer(false)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Keep Subscription
            </button>
          </div>

          {/* Trust message */}
          <p className="text-xs text-gray-500 text-center mt-4">
            No tricks, no hidden fees. Your choice is processed immediately.
          </p>
        </div>
      )}
    </div>
  );
} 