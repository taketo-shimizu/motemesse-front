'use client';

import { useSideMenuStore } from '@/store/sideMenu';

export default function Header() {
  const openMenu = useSideMenuStore(s => s.openMenu);
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 h-[60px] flex items-center space-x-3 py-3">
        <button
          id="settingsBtn"
          onClick={openMenu}
          className="p-2 rounded-full hover:bg-gray-50 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-tapple-pink to-tapple-pink-light rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">モテメッセ</h1>
        </div>

    </header>
  );
}