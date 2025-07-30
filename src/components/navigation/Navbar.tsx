'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import LoginButton from '../auth/LoginButton';

const NavigationMenu = ({ isAuthenticated }: { isAuthenticated: boolean }) => (
  <ul className="menu menu-horizontal px-1">
    {isAuthenticated && (
      <li>
        <a 
          href="/dashboard" 
          className="hover:bg-primary hover:text-primary-content transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          ダッシュボード
        </a>
      </li>
    )}
  </ul>
);

export default function Navbar() {
  const { user } = useUser();

  return (
    <div className="navbar bg-base-100 border-b shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl font-bold text-primary" href="/">
          <span className="text-2xl">📱</span>
          モテメッセ
        </a>
      </div>
      <div className="flex-none gap-2">
        <NavigationMenu isAuthenticated={!!user} />
        <LoginButton />
      </div>
    </div>
  );
}