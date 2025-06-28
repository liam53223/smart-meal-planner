'use client';

import { useState } from 'react';
import { DynamicQuestionnaire } from '@/components/questionnaire/DynamicQuestionnaire';
import { MealPlanResults } from '@/components/MealPlanResults';

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const handleQuestionnaireComplete = (data: any) => {
    setFormData(data);
    setShowResults(true);
  };

  const handleStartOver = () => {
    setShowResults(false);
    setFormData(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Smart Meal Planner
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create personalized meal plans tailored to your health needs, dietary preferences, and lifestyle.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {showResults ? (
            <MealPlanResults 
              formData={formData} 
              onStartOver={handleStartOver}
            />
          ) : (
            <DynamicQuestionnaire onComplete={handleQuestionnaireComplete} />
          )}
        </div>
      </div>
    </main>
  );
}
