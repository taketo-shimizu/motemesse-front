'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

const LoadingSpinner = () => (
  <div className="loading loading-spinner loading-sm"></div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="text-error text-sm">Error: {message}</div>
);

const UserWelcome = ({ userName }: { userName?: string }) => (
  <div className="flex items-center gap-4">
    <span className="text-sm text-base-content">
      ようこそ、{userName || 'ユーザー'}さん
    </span>
    <a
      href="/api/auth/logout"
      className="btn btn-outline btn-sm hover:btn-error"
    >
      ログアウト
    </a>
  </div>
);

const LoginLink = () => (
  <a
    href="/api/auth/login"
    className="btn btn-primary btn-sm"
  >
    ログイン
  </a>
);

export default function LoginButton() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error.message} />;
  if (user) return <UserWelcome userName={user.name || undefined} />;
  
  return <LoginLink />;
}