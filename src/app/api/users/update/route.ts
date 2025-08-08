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
    const {
      age, job, hobby, selfIntroduction,
      residence, workplace, bloodType, education, workType, holiday,
      marriageHistory, hasChildren, smoking, drinking, livingWith, marriageIntention
    } = body;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        age: age ? parseInt(age, 10) : null,
        job: job || null,
        hobby: hobby || null,
        selfIntroduction: selfIntroduction || null,
        residence: residence || null,
        workplace: workplace || null,
        bloodType: bloodType || null,
        education: education || null,
        workType: workType || null,
        holiday: holiday || null,
        marriageHistory: marriageHistory || null,
        hasChildren: hasChildren || null,
        smoking: smoking || null,
        drinking: drinking || null,
        livingWith: livingWith || null,
        marriageIntention: marriageIntention || null,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 