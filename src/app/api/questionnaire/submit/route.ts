import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the questionnaire data (in a real app, you'd save this to database)
    console.log('Questionnaire submitted:', body);
    
    // Simple validation
    if (!body.primaryGoal) {
      return NextResponse.json(
        { error: 'Primary goal is required' },
        { status: 400 }
      );
    }

    // Generate simple recommendations based on the form data
    const recommendations = generateRecommendations(body);
    
    const response = {
      success: true,
      message: 'Questionnaire submitted successfully',
      recommendations,
      userProfile: {
        id: `user_${Date.now()}`,
        ...body,
        createdAt: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error processing questionnaire:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process questionnaire'
      },
      { status: 500 }
    );
  }
}

function generateRecommendations(formData: any) {
  const recommendations = [];
  
  // Basic recommendations based on cooking skill
  if (formData.cookingSkill === 'Beginner') {
    recommendations.push({
      type: 'meal',
      title: 'Simple Pasta with Marinara',
      description: 'A quick and easy pasta dish perfect for beginners',
      prepTime: 15,
      difficulty: 'Easy'
    });
    recommendations.push({
      type: 'meal',
      title: 'Grilled Chicken Salad',
      description: 'Healthy and simple grilled chicken over mixed greens',
      prepTime: 20,
      difficulty: 'Easy'
    });
  } else if (formData.cookingSkill === 'Intermediate') {
    recommendations.push({
      type: 'meal',
      title: 'Chicken Stir-fry with Vegetables',
      description: 'Colorful stir-fry with fresh vegetables and tender chicken',
      prepTime: 25,
      difficulty: 'Medium'
    });
    recommendations.push({
      type: 'meal',
      title: 'Baked Salmon with Herbs',
      description: 'Flaky salmon baked with fresh herbs and lemon',
      prepTime: 30,
      difficulty: 'Medium'
    });
  } else {
    recommendations.push({
      type: 'meal',
      title: 'Beef Wellington',
      description: 'Classic beef wellington with mushroom duxelles',
      prepTime: 90,
      difficulty: 'Hard'
    });
    recommendations.push({
      type: 'meal',
      title: 'Homemade Pasta with Truffle Sauce',
      description: 'Fresh pasta made from scratch with luxurious truffle sauce',
      prepTime: 60,
      difficulty: 'Hard'
    });
  }

  // Filter by prep time
  const filteredRecommendations = recommendations.filter(
    rec => rec.prepTime <= formData.maxPrepTime
  );

  // Add goal-specific recommendations
  if (formData.primaryGoal === 'Weight Loss & Management') {
    filteredRecommendations.push({
      type: 'tip',
      title: 'Focus on Portion Control',
      description: 'Use smaller plates and measure portions to support your weight loss goals',
      prepTime: 0,
      difficulty: 'Easy'
    });
  }

  return filteredRecommendations;
} 