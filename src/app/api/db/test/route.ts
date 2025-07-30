import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // データベース接続テスト
    await prisma.$connect();
    
    // ユーザー数を取得してテスト
    const userCount = await prisma.user.count();
    
    // 接続を閉じる
    await prisma.$disconnect();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      userCount 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed' 
    }, { status: 500 });
  }
}