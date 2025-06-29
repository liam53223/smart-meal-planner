import { NextRequest, NextResponse } from 'next/server';
import { ViralSharingEngine } from '@/lib/social/viral-sharing-engine';

const sharingEngine = new ViralSharingEngine();

export async function POST(request: NextRequest) {
  try {
    const { userId, recipeId, photoUrl } = await request.json();

    // Validate input
    if (!userId || !recipeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate shareable content
    const shareContent = await sharingEngine.createShareableContent(
      userId,
      recipeId,
      photoUrl
    );

    return NextResponse.json(shareContent);

  } catch (error) {
    console.error('Error generating share content:', error);
    return NextResponse.json(
      { error: 'Failed to generate share content' },
      { status: 500 }
    );
  }
} 