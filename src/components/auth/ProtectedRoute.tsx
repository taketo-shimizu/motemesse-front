'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { ProtectedRouteProps } from '@/types/auth';

const LoadingScreen = () => (
  <div className="flex justify-center items-center min-h-screen bg-base-200">
    <div className="text-center">
      <div className="loading loading-spinner loading-lg text-primary"></div>
      <p className="mt-4 text-base-content">認証情報を確認中...</p>
    </div>
  </div>
);

const ErrorScreen = ({ message }: { message: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-base-200">
    <div className="alert alert-error max-w-md">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <h3 className="font-bold">認証エラー</h3>
        <div className="text-xs">{message}</div>
      </div>
    </div>
  </div>
);

const LoginPrompt = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 gap-6">
    <div className="text-center space-y-4">
      <div className="text-6xl">🔒</div>
      <h2 className="text-3xl font-bold text-base-content">ログインが必要です</h2>
      <p className="text-base-content/70 max-w-md">
        このページにアクセスするには、アカウントにログインしてください。
      </p>
    </div>
    <a href="/api/auth/login" className="btn btn-primary btn-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      ログイン
    </a>
  </div>
);

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error.message} />;
  if (!user) return fallback || <LoginPrompt />;

  return <>{children}</>;
}