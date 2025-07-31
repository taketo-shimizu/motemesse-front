'use client';

import { useSideMenuStore } from '@/store/sideMenu';
import { FiSettings, FiPlus } from 'react-icons/fi';

export default function Header() {
  const { openMenu } = useSideMenuStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          id="settingsBtn"
          onClick={openMenu}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FiSettings className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">モテメッセ</h1>
      </div>

      <div className="flex items-center space-x-3">
        <select id="womanSelect" className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">女性を選択...</option>
        </select>
        <button id="addWomanBtn" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center">
          <FiPlus className="w-4 h-4 mr-1" />
          新規追加
        </button>
      </div>
    </header>
  );
}