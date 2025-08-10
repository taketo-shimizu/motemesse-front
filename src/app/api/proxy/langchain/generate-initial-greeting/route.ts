import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バックエンドAPIのURLを環境変数から取得
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // バックエンドAPIにリクエストを転送
    const response = await fetch(`${apiUrl}/api/langchain/generate-initial-greeting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorDetail = 'Failed to generate initial greeting';
      try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorDetail;
      } catch { }
      return NextResponse.json(
        { error: errorDetail },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error (initial greeting):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 