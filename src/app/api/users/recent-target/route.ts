import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recentTargetId } = await request.json();

    // recentTargetIdが数値でない場合はnullに設定
    const targetId = typeof recentTargetId === 'number' ? recentTargetId : null;

    // ユーザーのrecent_target_idを更新
    const updatedUser = await prisma.user.update({
      where: {
        auth0Id: session.user.sub,
      },
      data: {
        recentTargetId: targetId,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating recent target:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
