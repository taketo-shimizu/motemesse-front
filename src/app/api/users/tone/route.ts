import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    let session;
    try {
      session = await getSession();
    } catch (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { tone } = body;

    if (tone === undefined || tone === null) {
      return NextResponse.json({ error: 'Tone is required' }, { status: 400 });
    }

    // Validate tone value (0-3)
    const toneValue = parseInt(tone, 10);
    if (isNaN(toneValue) || toneValue < 0 || toneValue > 3) {
      return NextResponse.json({ error: 'Tone must be a number between 0 and 3' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user tone
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        tone: toneValue,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user tone:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 