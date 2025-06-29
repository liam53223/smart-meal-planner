'use client';

import React from 'react';

interface MealPlanResultsProps {
  formData: {
    primaryGoal: string;
    activityLevel: string;
    targetCalories: string;
    cookingSkill: string;
    knifeSkillLevel: string;
    preferredTechniques: string[];
    recipeComplexityComfort: number;
    maxPrepTime: number;
    appliances: string[];
    budgetRange: string;
    weeklyFoodBudget: string;
    shoppingFrequency: string;
    mealPlanningApproach: number;
    householdSize: number;
    cuisinePreferences: string[];
    spiceTolerance: number;
    flavorIntensity: number;
    mealTimingPreference: string;
    allergies: string[];
    textureLimitations: string;
    foodsToAvoid: string;
    portionControlMotivation: number;
    habitChangeReadiness: string[];
    socialEatingPattern: number;
    successTrackingPreference: string;
  };
  onStartOver: () => void;
}

export function MealPlanResults({ formData, onStartOver }: MealPlanResultsProps) {
  // Sample meal recommendations based on form data
  const getMealRecommendations = () => {
    const recommendations = [];
    
    // Based on cooking skill
    if (formData.cookingSkill === 'Beginner') {
      recommendations.push({
        meal: 'Simple Pasta with Marinara',
        prepTime: 15,
        difficulty: 'Easy',
        description: 'A quick and easy pasta dish perfect for beginners'
      });
      recommendations.push({
        meal: 'Grilled Chicken Salad',
        prepTime: 20,
        difficulty: 'Easy',
        description: 'Healthy and simple grilled chicken over mixed greens'
      });
    } else if (formData.cookingSkill === 'Intermediate') {
      recommendations.push({
        meal: 'Chicken Stir-fry with Vegetables',
        prepTime: 25,
        difficulty: 'Medium',
        description: 'Colorful stir-fry with fresh vegetables and tender chicken'
      });
      recommendations.push({
        meal: 'Baked Salmon with Herbs',
        prepTime: 30,
        difficulty: 'Medium',
        description: 'Flaky salmon baked with fresh herbs and lemon'
      });
    } else {
      recommendations.push({
        meal: 'Beef Wellington',
        prepTime: 90,
        difficulty: 'Hard',
        description: 'Classic beef wellington with mushroom duxelles'
      });
      recommendations.push({
        meal: 'Homemade Pasta with Truffle Sauce',
        prepTime: 60,
        difficulty: 'Hard',
        description: 'Fresh pasta made from scratch with luxurious truffle sauce'
      });
    }

    // Filter by prep time
    return recommendations.filter(rec => rec.prepTime <= formData.maxPrepTime);
  };

  const recommendations = getMealRecommendations();

  const getGoalDescription = () => {
    switch (formData.primaryGoal) {
      case 'Weight Loss & Management':
        return 'Focus on nutrient-dense, lower-calorie meals that keep you satisfied';
      case 'Muscle Gain & Fitness':
        return 'Protein-rich meals to support muscle growth and recovery';
      case 'Managing a Health Condition':
        return 'Carefully selected meals that support your health goals';
      case 'Following a Lifestyle Diet':
        return 'Meals that align with your chosen dietary lifestyle';
      default:
        return 'Balanced meals for overall health and wellness';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your Personalized Meal Plan
        </h2>
        <p className="text-lg text-gray-600">
          Based on your preferences, here's what we recommend for you
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Primary Goal</p>
            <p className="font-medium text-gray-800">{formData.primaryGoal}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Activity Level</p>
            <p className="font-medium text-gray-800">{formData.activityLevel}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cooking Skill Level</p>
            <p className="font-medium text-gray-800">{formData.cookingSkill}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Max Prep Time</p>
            <p className="font-medium text-gray-800">{formData.maxPrepTime} minutes</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Budget Range</p>
            <p className="font-medium text-gray-800">{formData.budgetRange}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Household Size</p>
            <p className="font-medium text-gray-800">{formData.householdSize} people</p>
          </div>
          {formData.appliances.length > 0 && (
            <div>
              <p className="text-sm text-gray-600">Available Appliances</p>
              <p className="font-medium text-gray-800">{formData.appliances.join(', ')}</p>
            </div>
          )}
          {formData.cuisinePreferences.length > 0 && (
            <div>
              <p className="text-sm text-gray-600">Cuisine Preferences</p>
              <p className="font-medium text-gray-800">{formData.cuisinePreferences.join(', ')}</p>
            </div>
          )}
          {formData.allergies.length > 0 && !formData.allergies.includes('None') && (
            <div>
              <p className="text-sm text-gray-600">Allergies/Restrictions</p>
              <p className="font-medium text-gray-800">{formData.allergies.join(', ')}</p>
            </div>
          )}
        </div>
        <div className="mt-4 p-4 bg-white rounded-lg">
          <p className="text-sm text-gray-700">{getGoalDescription()}</p>
          {formData.habitChangeReadiness.length > 0 && (
            <p className="text-sm text-gray-700 mt-2">
              <strong>Ready for:</strong> {formData.habitChangeReadiness.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Meal Recommendations */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Recommended Meals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((meal, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-gray-800">{meal.meal}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  meal.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  meal.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {meal.difficulty}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{meal.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {meal.prepTime} minutes
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-green-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Next Steps</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</div>
            <div>
              <p className="font-medium text-gray-800">Review Your Meal Plan</p>
              <p className="text-sm text-gray-600">Take a look at the recommended meals and see if they fit your preferences</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</div>
            <div>
              <p className="font-medium text-gray-800">Generate Shopping List</p>
              <p className="text-sm text-gray-600">We'll create a comprehensive shopping list based on your selected meals</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</div>
            <div>
              <p className="font-medium text-gray-800">Start Cooking!</p>
              <p className="text-sm text-gray-600">Follow our step-by-step recipes and enjoy your personalized meals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Generate Full Meal Plan
        </button>
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
          Create Shopping List
        </button>
        <button 
          onClick={onStartOver}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Start Over
        </button>
      </div>
    </div>
  );
} 