import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';

const prisma = new PrismaClient();

// 会話履歴を取得
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const targetId = searchParams.get('targetId');

    if (!targetId) {
      return NextResponse.json({ error: 'targetId is required' }, { status: 400 });
    }

    // Auth0 IDからユーザーを取得
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 会話履歴を取得
    const conversations = await prisma.conversation.findMany({
      where: {
        userId: user.id,
        targetId: parseInt(targetId)
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        target: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 新しい会話を保存
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { targetId, femaleMessage, maleReply } = body;

    if (!targetId || !femaleMessage || !maleReply) {
      return NextResponse.json({
        error: 'targetId, femaleMessage, and maleReply are required'
      }, { status: 400 });
    }

    // Auth0 IDからユーザーを取得
    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ターゲットが存在し、ユーザーのものであることを確認
    const target = await prisma.target.findFirst({
      where: {
        id: parseInt(targetId),
        userId: user.id
      }
    });

    if (!target) {
      return NextResponse.json({ error: 'Target not found' }, { status: 404 });
    }

    // 会話を保存
    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
        targetId: parseInt(targetId),
        femaleMessage,
        maleReply
      },
      include: {
        target: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 