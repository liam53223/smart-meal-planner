'use client';

import React, { useState } from 'react';

interface DynamicQuestionnaireProps {
  onComplete?: (data: any) => void;
}

export function DynamicQuestionnaire({ onComplete }: DynamicQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic info
    primaryGoal: '',
    activityLevel: '',
    targetCalories: '',
    
    // Cooking preferences
    cookingSkill: '',
    knifeSkillLevel: '',
    preferredTechniques: [] as string[],
    recipeComplexityComfort: 3,
    maxPrepTime: 30,
    
    // Equipment
    appliances: [] as string[],
    
    // Budget & Shopping
    budgetRange: '',
    weeklyFoodBudget: '',
    shoppingFrequency: '',
    mealPlanningApproach: 3,
    householdSize: 2,
    
    // Cuisine & Flavor
    cuisinePreferences: [] as string[],
    spiceTolerance: 3,
    flavorIntensity: 3,
    mealTimingPreference: '',
    
    // Dietary
    allergies: [] as string[],
    textureLimitations: '',
    foodsToAvoid: '',
    
    // Behavioral
    portionControlMotivation: 3,
    habitChangeReadiness: [] as string[],
    socialEatingPattern: 3,
    successTrackingPreference: ''
  });

  const steps = [
    {
      title: 'What brings you here today?',
      description: 'Help us understand your main focus so we can personalize your experience',
      questions: [
        {
          id: 'primaryGoal',
          question: 'What is your primary goal?',
          type: 'single_choice',
          options: [
            'Weight Loss & Management',
            'Muscle Gain & Fitness',
            'Managing a Health Condition',
            'Following a Lifestyle Diet',
            'General Health & Wellness'
          ]
        },
        {
          id: 'activityLevel',
          question: 'How would you describe your activity level?',
          type: 'single_choice',
          options: [
            'Sedentary (little to no exercise)',
            'Lightly Active (1-3 days/week)',
            'Moderately Active (3-5 days/week)',
            'Very Active (6-7 days/week)',
            'Extremely Active (physical job + exercise)'
          ]
        },
        {
          id: 'targetCalories',
          question: 'Do you have a target calorie range? (optional)',
          type: 'single_choice',
          options: [
            'Under 1500 calories',
            '1500-2000 calories',
            '2000-2500 calories',
            '2500-3000 calories',
            'Over 3000 calories',
            'Not sure / No preference'
          ]
        }
      ]
    },
    {
      title: 'Your cooking experience',
      description: 'Help us match recipes to your skill level and preferences',
      questions: [
        {
          id: 'cookingSkill',
          question: 'How would you describe your overall cooking skills?',
          type: 'single_choice',
          options: ['Beginner', 'Intermediate', 'Advanced']
        },
        {
          id: 'knifeSkillLevel',
          question: 'How comfortable are you with knife work?',
          type: 'single_choice',
          options: [
            'Basic (can chop vegetables)',
            'Intermediate (can dice, julienne)',
            'Advanced (professional techniques)'
          ]
        },
        {
          id: 'preferredTechniques',
          question: 'Which cooking techniques do you enjoy? (Select all that apply)',
          type: 'multiple_choice',
          options: [
            'Grilling',
            'Stir-frying',
            'Baking',
            'Roasting',
            'Steaming',
            'Slow cooking',
            'Pressure cooking',
            'No-cook meals'
          ]
        },
        {
          id: 'recipeComplexityComfort',
          question: 'How complex of recipes are you comfortable with?',
          type: 'scale',
          min: 1,
          max: 5,
          labels: ['Very Simple', 'Simple', 'Moderate', 'Complex', 'Very Complex']
        }
      ]
    },
    {
      title: 'Kitchen equipment',
      description: 'Tell us what appliances you have access to',
      questions: [
        {
          id: 'appliances',
          question: 'Which appliances do you have? (Select all that apply)',
          type: 'multiple_choice',
          options: [
            'Oven',
            'Stove/Hob',
            'Microwave',
            'Air Fryer',
            'Instant Pot/Pressure Cooker',
            'Slow Cooker',
            'Blender',
            'Food Processor',
            'Grill/BBQ'
          ]
        },
        {
          id: 'maxPrepTime',
          question: 'Maximum time you want to spend preparing meals (minutes)?',
          type: 'number',
          min: 5,
          max: 180
        }
      ]
    },
    {
      title: 'Budget & shopping',
      description: 'Help us understand your budget and shopping preferences',
      questions: [
        {
          id: 'budgetRange',
          question: 'What\'s your grocery budget preference?',
          type: 'single_choice',
          options: ['Budget-conscious', 'Moderate spending', 'Premium ingredients']
        },
        {
          id: 'weeklyFoodBudget',
          question: 'Weekly food budget per person (optional)?',
          type: 'single_choice',
          options: [
            'Under $50',
            '$50-$75',
            '$75-$100',
            '$100-$150',
            'Over $150',
            'Prefer not to say'
          ]
        },
        {
          id: 'shoppingFrequency',
          question: 'How often do you grocery shop?',
          type: 'single_choice',
          options: [
            'Daily',
            '2-3 times per week',
            'Weekly',
            'Every 2 weeks',
            'Monthly'
          ]
        },
        {
          id: 'householdSize',
          question: 'How many people are you cooking for?',
          type: 'number',
          min: 1,
          max: 20
        },
        {
          id: 'mealPlanningApproach',
          question: 'How flexible do you like your meal plans?',
          type: 'scale',
          min: 1,
          max: 5,
          labels: ['Very Rigid', 'Structured', 'Balanced', 'Flexible', 'Very Flexible']
        }
      ]
    },
    {
      title: 'Cuisine & flavor preferences',
      description: 'Tell us about your taste preferences',
      questions: [
        {
          id: 'cuisinePreferences',
          question: 'Which cuisines do you enjoy? (Select all that apply)',
          type: 'multiple_choice',
          options: [
            'Italian',
            'Asian (Chinese/Japanese/Thai)',
            'Mexican',
            'Mediterranean',
            'Indian',
            'American',
            'French',
            'Middle Eastern',
            'African',
            'Latin American'
          ]
        },
        {
          id: 'spiceTolerance',
          question: 'How spicy do you like your food?',
          type: 'scale',
          min: 1,
          max: 5,
          labels: ['No spice', 'Mild', 'Medium', 'Hot', 'Very hot']
        },
        {
          id: 'flavorIntensity',
          question: 'How intense do you like flavors?',
          type: 'scale',
          min: 1,
          max: 5,
          labels: ['Very mild', 'Mild', 'Moderate', 'Bold', 'Very bold']
        },
        {
          id: 'mealTimingPreference',
          question: 'When do you prefer your largest meal?',
          type: 'single_choice',
          options: [
            'Breakfast',
            'Lunch',
            'Dinner',
            'Equal portions throughout'
          ]
        }
      ]
    },
    {
      title: 'Dietary needs & restrictions',
      description: 'Tell us about any allergies or foods you need to avoid',
      questions: [
        {
          id: 'allergies',
          question: 'Do you have any food allergies or intolerances? (Select all that apply)',
          type: 'multiple_choice',
          options: [
            'Dairy/Lactose',
            'Gluten/Wheat',
            'Nuts (Tree nuts)',
            'Peanuts',
            'Shellfish',
            'Fish',
            'Eggs',
            'Soy',
            'Corn',
            'Nightshades',
            'None'
          ]
        },
        {
          id: 'textureLimitations',
          question: 'Any texture issues we should know about? (optional)',
          type: 'text',
          placeholder: 'e.g., can\'t eat crunchy foods, prefer smooth textures'
        },
        {
          id: 'foodsToAvoid',
          question: 'Any other foods you want to avoid? (optional)',
          type: 'text',
          placeholder: 'e.g., mushrooms, onions, spicy foods'
        }
      ]
    },
    {
      title: 'Behavior & motivation',
      description: 'Help us understand your readiness for change',
      questions: [
        {
          id: 'portionControlMotivation',
          question: 'How motivated are you to control portions?',
          type: 'scale',
          min: 1,
          max: 5,
          labels: ['Not motivated', 'Slightly', 'Moderately', 'Very', 'Extremely']
        },
        {
          id: 'habitChangeReadiness',
          question: 'What changes are you ready to make? (Select all that apply)',
          type: 'multiple_choice',
          options: [
            'Meal prep on weekends',
            'Try new foods',
            'Learn new cooking skills',
            'Track my meals',
            'Eat more vegetables',
            'Reduce processed foods',
            'Cook more at home'
          ]
        },
        {
          id: 'socialEatingPattern',
          question: 'How often do you eat with others?',
          type: 'scale',
          min: 1,
          max: 5,
          labels: ['Always alone', 'Mostly alone', 'Mixed', 'Mostly social', 'Always social']
        },
        {
          id: 'successTrackingPreference',
          question: 'How do you prefer to track progress?',
          type: 'single_choice',
          options: [
            'Visual charts/graphs',
            'Numbers and metrics',
            'Journal/notes',
            'Photos',
            'No tracking needed'
          ]
        }
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const handleInputChange = (questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your API
    if (onComplete) {
      onComplete(formData);
    } else {
      alert('Questionnaire completed! Check the console for the data.');
    }
  };

  const renderQuestion = (question: any) => {
    const value = formData[question.id as keyof typeof formData];

    switch (question.type) {
      case 'single_choice':
        return (
          <div className="space-y-3">
            {question.options.map((option: string, index: number) => (
              <label
                key={index}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options.map((option: string, index: number) => (
              <label
                key={index}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleInputChange(question.id, [...currentValues, option]);
                    } else {
                      handleInputChange(question.id, currentValues.filter(v => v !== option));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-3">
            <input
              type="number"
              value={value || ''}
              onChange={(e) => handleInputChange(question.id, parseInt(e.target.value) || 0)}
              min={question.min}
              max={question.max}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Min: {question.min}</span>
              <span>Max: {question.max}</span>
            </div>
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-3">
            <input
              type="range"
              value={value || question.min || 1}
              onChange={(e) => handleInputChange(question.id, parseInt(e.target.value))}
              min={question.min}
              max={question.max}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              {question.labels ? (
                question.labels.map((label: string, index: number) => (
                  <span key={index} className={index === Math.floor(question.labels.length / 2) ? 'font-medium' : ''}>
                    {label}
                  </span>
                ))
              ) : (
                <>
                  <span>{question.min}</span>
                  <span className="font-medium">{value || question.min}</span>
                  <span>{question.max}</span>
                </>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600">
            {currentStepData.description}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {currentStepData.questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                {question.question}
              </label>
              {renderQuestion(question)}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div className="flex items-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {currentStep === steps.length - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
          >
            ✓ Complete
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
} 