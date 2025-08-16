'use client';

import { useRouter } from 'next/navigation';
import { useSideMenuStore } from '@/store/sideMenu';
import { FiX,FiLogOut,FiUser } from 'react-icons/fi';
import { MdChatBubbleOutline } from 'react-icons/md';
import { useUserStore } from '@/store/user';

export default function SideMenu() {
  const { isOpen, closeMenu } = useSideMenuStore();
  const router = useRouter();
  const { user, updateTone } = useUserStore();

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  const handleProfileUserSettings = () => {
    router.push('/user-setting');
    closeMenu();
  };

  const handleProfileFemaleSettings = () => {
    router.push('/female-setting');
    closeMenu();
  };

  const handleChatHistory = () => {
    router.push('/chat');
    closeMenu();
  };

  const handleToneChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tone = parseInt(e.target.value);
    try {
      await updateTone(tone);
    } catch (error) {
      console.error('Failed to update tone:', error);
    }
  };

  return (
    <div
      id="settingsPanel"
      className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 p-6 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">設定</h2>
        <button
          id="closeSettings"
          onClick={closeMenu}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">返信のトーン</label>
          <select
            id="replyTone"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={user?.tone ?? 0}
            onChange={handleToneChange}
          >
            <option value={0}>敬語</option>
            <option value={1}>タメ口</option>
          </select>
        </div>

        <button
          id="profileSettingsBtn"
          onClick={handleChatHistory}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition-colors flex items-center"
        >
          <MdChatBubbleOutline className="w-5 h-5 mr-2" />
          チャット履歴
        </button>

        <button
          id="profileSettingsBtn"
          onClick={handleProfileUserSettings}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition-colors flex items-center"
        >
          <FiUser className="w-5 h-5 mr-2 text-blue-600" />
          プロフィール設定（あなた）
        </button>

        <button
          id="profileSettingsBtn"
          onClick={handleProfileFemaleSettings}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition-colors flex items-center"
        >
          <FiUser className="w-5 h-5 mr-2 text-pink-600" />
          プロフィール設定（女性）
        </button>

        {/*<button id="clearHistoryBtn" className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-lg transition-colors flex items-center">
          <FiTrash2 className="w-4 h-4 mr-2" />
          履歴を削除
        </button>*/}

        <button
          onClick={handleLogout}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center mt-6"
        >
          <FiLogOut className="w-4 h-4 mr-2" />
          ログアウト
        </button>
      </div>
    </div>
  );
}