import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all targets for the user
    const targets = await prisma.target.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(targets);
  } catch (error) {
    console.error('Error fetching targets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
      name,
      age,
      job,
      hobby,
      residence,
      workplace,
      bloodType,
      education,
      workType,
      holiday,
      marriageHistory,
      hasChildren,
      smoking,
      drinking,
      livingWith,
      marriageIntention,
      selfIntroduction
    } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create new target with all profile data
    const target = await prisma.target.create({
      data: {
        name: name.trim(),
        age: age ? parseInt(age) : null,
        job: job || null,
        hobby: hobby || null,
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
        selfIntroduction: selfIntroduction || null,
        userId: user.id
      }
    });
    console.log('target', target);

    // Update user's recent_target_id to the newly created target
    await prisma.user.update({
      where: { id: user.id },
      data: { recentTargetId: target.id }
    });

    return NextResponse.json(target);
  } catch (error) {
    console.error('Error creating target:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const targetIdParam = searchParams.get('id');

    if (!targetIdParam) {
      return NextResponse.json({ error: 'Target ID is required' }, { status: 400 });
    }

    // Convert string ID to number (Prisma expects Int, not string)
    const targetId = parseInt(targetIdParam, 10);

    if (isNaN(targetId)) {
      return NextResponse.json({ error: 'Invalid Target ID' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if target belongs to user
    const target = await prisma.target.findFirst({
      where: {
        id: targetId,
        userId: user.id
      }
    });

    if (!target) {
      return NextResponse.json({ error: 'Target not found' }, { status: 404 });
    }

    // Delete the target
    await prisma.target.delete({
      where: { id: targetId }
    });

    // Find the most recently updated target for this user to set as recent_target_id
    const mostRecentTarget = await prisma.target.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' }
    });

    // Update user's recent_target_id (null if no targets remain)
    await prisma.user.update({
      where: { id: user.id },
      data: { recentTargetId: mostRecentTarget?.id || null }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting target:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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
      id, name, age, job, hobby, selfIntroduction,
      residence, workplace, bloodType, education, workType, holiday,
      marriageHistory, hasChildren, smoking, drinking, livingWith, marriageIntention
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Target ID is required' }, { status: 400 });
    }

    // Convert string ID to number
    const targetId = parseInt(id, 10);

    if (isNaN(targetId)) {
      return NextResponse.json({ error: 'Invalid Target ID' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if target belongs to user
    const existingTarget = await prisma.target.findFirst({
      where: {
        id: targetId,
        userId: user.id
      }
    });

    if (!existingTarget) {
      return NextResponse.json({ error: 'Target not found' }, { status: 404 });
    }

    // Update the target
    const updatedTarget = await prisma.target.update({
      where: { id: targetId },
      data: {
        name: name || null,
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

    // Update user's recent_target_id to the updated target
    await prisma.user.update({
      where: { id: user.id },
      data: { recentTargetId: targetId }
    });

    return NextResponse.json(updatedTarget);
  } catch (error) {
    console.error('Error updating target:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}