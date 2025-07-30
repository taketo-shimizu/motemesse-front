'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Navbar from '@/components/navigation/Navbar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const UserInfoCard = ({ user }: { user: any }) => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <h2 className="card-title justify-center text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        ユーザー情報
      </h2>
      <div className="divider"></div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="badge badge-primary badge-sm">名前</span>
          <span className="text-base-content">{user?.name || '未設定'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-secondary badge-sm">メール</span>
          <span className="text-base-content">{user?.email || '未設定'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-accent badge-sm">最終ログイン</span>
          <span className="text-base-content text-sm">
            {user?.updated_at ? new Date(user.updated_at).toLocaleString('ja-JP') : 'N/A'}
          </span>
        </div>
        {user?.email_verified && (
          <div className="flex items-center gap-3">
            <span className="badge badge-success badge-sm">✓ 認証済み</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const WelcomeSection = ({ userName }: { userName?: string }) => (
  <div className="text-center space-y-4">
    <div className="avatar placeholder">
      <div className="bg-primary text-primary-content rounded-full w-20">
        <span className="text-2xl">👤</span>
      </div>
    </div>
    <div>
      <h1 className="text-4xl font-bold text-primary mb-2">ダッシュボード</h1>
      <p className="text-lg text-base-content/70">
        ようこそ、{userName || 'ユーザー'}さん！
      </p>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useUser();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-8">
            <WelcomeSection userName={user?.name || undefined} />
            
            <div className="grid gap-6 md:grid-cols-2">
              <UserInfoCard user={user} />
              
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    クイックアクション
                  </h2>
                  <div className="divider"></div>
                  <div className="space-y-3">
                    <button className="btn btn-outline btn-block justify-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      プロフィール編集
                    </button>
                    <button className="btn btn-outline btn-block justify-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      設定
                    </button>
                    <a href="/api/auth/logout" className="btn btn-error btn-outline btn-block justify-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      ログアウト
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}