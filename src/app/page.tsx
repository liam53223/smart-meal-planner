'use client';

import { useState } from 'react';
import { DynamicQuestionnaire } from '@/components/questionnaire/DynamicQuestionnaire';
import { MealPlanResults } from '@/components/MealPlanResults';
import { KojoChat } from '@/components/KojoChat';

export default function Home() {
  const [appState, setAppState] = useState<'questionnaire' | 'results' | 'chat'>('questionnaire');
  const [formData, setFormData] = useState<any>(null);

  const handleQuestionnaireComplete = (data: any) => {
    setFormData(data);
    setAppState('results');
  };

  const handleStartOver = () => {
    setAppState('questionnaire');
    setFormData(null);
  };

  const handleChatWithKojo = () => {
    setAppState('chat');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-3xl">
              🧘
            </div>
            <h1 className="text-4xl font-bold text-gray-800">
              Flavor Monk
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your AI nutrition assistant that understands YOUR kitchen and creates personalized meal plans with evidence-based guidance.
          </p>
        </div>
        
        {/* Navigation Tabs (if user has completed questionnaire) */}
        {formData && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-md p-1 flex space-x-1">
              <button
                onClick={() => setAppState('results')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  appState === 'results' 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                📊 Your Profile
              </button>
              <button
                onClick={() => setAppState('chat')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  appState === 'chat' 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                💬 Chat with Kojo
              </button>
              <button
                onClick={handleStartOver}
                className="px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
              >
                🔄 Start Over
              </button>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {appState === 'questionnaire' && (
            <DynamicQuestionnaire onComplete={handleQuestionnaireComplete} />
          )}
          
          {appState === 'results' && formData && (
            <div>
              <MealPlanResults formData={formData} onStartOver={handleStartOver} />
              <div className="mt-8 text-center">
                <button
                  onClick={handleChatWithKojo}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
                >
                  💬 Chat with Kojo for Personalized Advice
                </button>
              </div>
            </div>
          )}
          
          {appState === 'chat' && formData && (
            <KojoChat 
              userProfile={formData}
              onRecipeSelect={(recipe) => console.log('Recipe selected:', recipe)}
              onMealPlanGenerated={(plan) => console.log('Meal plan generated:', plan)}
            />
          )}
        </div>
      </div>
    </main>
  );
}
