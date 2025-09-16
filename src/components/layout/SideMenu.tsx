'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSideMenuStore } from '@/store/sideMenu';
import { FiX, FiLogOut, FiUser, FiPlus, FiTrash2 } from 'react-icons/fi';
import { MdChatBubbleOutline } from 'react-icons/md';
import { useUserStore } from '@/store/user';
import { useTargetsStore } from '@/store/targets';

export default function SideMenu() {
  const { isOpen, closeMenu } = useSideMenuStore();
  const router = useRouter();
  const { user, updateTone, updateRecentTargetId } = useUserStore();
  const { targets, selectedTargetId, selectTarget, fetchTargets, handleSelectChange } = useTargetsStore();

  // コンポーネントマウント時にターゲット情報を取得
  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

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

  const handleSelectChangeWithRecentTarget = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleSelectChange(e);
    const targetIdString = e.target.value;
    const targetId = targetIdString ? parseInt(targetIdString, 10) : null;

    try {
      await updateRecentTargetId(targetId);
    } catch (error) {
      console.error('Error updating recent target:', error);
    }
  };

  const handleAddClick = () => {
    const name = prompt('女性の名前を入力してください');

    if (!name?.trim()) return;

    // 名前をクエリパラメータとして渡してプロフィール設定画面に遷移
    router.push(`/female-setting?new=true&name=${encodeURIComponent(name.trim())}`);
    closeMenu();
  };

  const handleDeleteClick = async () => {
    if (!selectedTargetId) {
      alert('削除する女性を選択してください');
      return;
    }
    const selectedTarget = targets.find(t => t.id === selectedTargetId);
    if (!selectedTarget) return;

    if (!confirm(`${selectedTarget.name}さんを削除してもよろしいですか？`)) {
      return;
    }

    try {
      const response = await fetch(`/api/targets?id=${selectedTargetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete target');
      }

      selectTarget(null);
      await fetchTargets();
      alert(`${selectedTarget.name}さんを削除しました`);
    } catch (error) {
      console.error('Error deleting target:', error);
      alert('削除に失敗しました');
    }
  };

  return (
    <>
      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* サイドメニュー */}
      <div
        id="settingsPanel"
        className={`grid grid-rows-[auto_1fr_auto] fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-tapple-pink to-tapple-pink-light p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <span className="font-bold text-lg">M</span>
              </div>
              <h2 className="text-lg font-bold">メニュー</h2>
            </div>
            <button
              id="closeSettings"
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          {user && (
            <div className="text-sm opacity-90">
              ようこそ、{user.name || 'ユーザー'}さん
            </div>
          )}
        </div>

        {/* メニュー項目 - スクロール可能エリア */}
        <div className="overflow-y-auto">
          <div className="p-4 space-y-2">
            {/* 相手選択セクション */}
            <div className="p-4 bg-gray-50 rounded-2xl">
              <label className="block text-sm font-medium text-gray-700 mb-3">相手を選択</label>
              <div className="space-y-3">
                <div className="relative">
                  <select
                    value={selectedTargetId?.toString() || ''}
                    onChange={handleSelectChangeWithRecentTarget}
                    className="appearance-none w-full bg-white border border-gray-200 rounded-full pl-4 pr-10 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent"
                  >
                    <option value="">相手を選択してください</option>
                    {targets.map((target) => (
                      <option key={target.id} value={target.id.toString()}>
                        {target.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleAddClick}
                    className="flex-1 flex items-center justify-center px-4 py-2.5 bg-tapple-pink hover:bg-tapple-pink-dark text-white rounded-full text-xs font-medium transition-colors"
                  >
                    <FiPlus className="w-4 h-4 mr-1.5" />
                    新規追加
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    disabled={!selectedTargetId}
                    className="flex items-center justify-center px-4 py-2.5 bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-600 rounded-full text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 className="w-4 h-4 mr-1.5" />
                    削除
                  </button>
                </div>
              </div>
            </div>

            {/* トーン設定 */}
            <div className="p-4 bg-gray-50 rounded-2xl">
              <label className="block text-sm font-medium text-gray-700 mb-3">返信のトーン</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateTone(0)}
                  className={`flex-1 py-2.5 px-4 rounded-full text-xs font-medium transition-all ${user?.tone === 0
                    ? 'bg-tapple-pink text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-tapple-pink'
                    }`}
                >
                  敬語
                </button>
                <button
                  onClick={() => updateTone(1)}
                  className={`flex-1 py-2.5 px-4 rounded-full text-xs font-medium transition-all ${user?.tone === 1
                    ? 'bg-tapple-pink text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-tapple-pink'
                    }`}
                >
                  タメ口
                </button>
              </div>
            </div>

            {/* メニューボタン */}
            <button
              onClick={handleChatHistory}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-2xl transition-all flex items-center justify-between group border border-gray-100 hover:border-tapple-pink/30 text-sm"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-tapple-pink/10 to-tapple-pink-light/10 rounded-full flex items-center justify-center mr-3">
                  <MdChatBubbleOutline className="w-5 h-5 text-tapple-pink" />
                </div>
                <span className="font-medium">チャット履歴</span>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-tapple-pink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={handleProfileUserSettings}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-2xl transition-all flex items-center justify-between group border border-gray-100 hover:border-tapple-pink/30 text-sm"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full flex items-center justify-center mr-3">
                  <FiUser className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <span className="font-medium block">プロフィール設定</span>
                  <span className="text-xs text-gray-500">あなたの情報</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-tapple-pink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={handleProfileFemaleSettings}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-2xl transition-all flex items-center justify-between group border border-gray-100 hover:border-tapple-pink/30 text-sm"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-tapple-pink/10 to-tapple-pink-light/10 rounded-full flex items-center justify-center mr-3">
                  <FiUser className="w-5 h-5 text-tapple-pink" />
                </div>
                <div className="text-left">
                  <span className="font-medium block">プロフィール設定</span>
                  <span className="text-xs text-gray-500">相手の情報</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-tapple-pink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* ログアウトボタン - 下部固定 */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="text-sm w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center font-medium"
          >
            <FiLogOut className="w-5 h-5 mr-2" />
            ログアウト
          </button>
        </div>
      </div>
    </>
  );
}