import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withMiddlewareAuthRequired, getSession } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired(async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getSession(req, res);

  if (session?.user) {
    // ログイン後の初回アクセス時にユーザー同期を実行
    const userSyncedCookie = req.cookies.get('user_synced');
    const lastSyncedEmail = req.cookies.get('last_synced_email');
    
    // 同期が必要な条件：
    // 1. 初回（クッキーなし）
    // 2. メールアドレスが変更された
    const needsSync = !userSyncedCookie || 
                     (lastSyncedEmail && lastSyncedEmail.value !== session.user.email);
    
    if (needsSync) {
      // 同期APIを呼び出す
      const syncResponse = await fetch(new URL('/api/users/sync', req.url), {
        method: 'POST',
        headers: {
          cookie: req.headers.get('cookie') || '',
        },
      });

      if (syncResponse.ok) {
        // 同期完了フラグをクッキーに設定
        res.cookies.set('user_synced', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 24時間
        });
        
        // 最後に同期したメールアドレスを記録
        res.cookies.set('last_synced_email', session.user.email, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 24時間
        });
      }
    }
  }

  return res;
});

export const config = {
  matcher: [
    // 認証が必要なルートを指定
    '/chat/:path*',
    '/api/protected/:path*',
  ],
};