'use client';

import { useState, useEffect } from 'react';
import { useSideMenuStore } from '@/store/sideMenu';
import { useTargetsStore } from '@/store/targets';
import { FiSettings, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function Header() {
  const { openMenu } = useSideMenuStore();
  const { targets, selectedTargetId, selectTarget, fetchTargets, handleSelectChange } = useTargetsStore();

  const handleAddClick = async () => {
    const name = prompt('女性の名前を入力してください');

    if (!name?.trim()) return;

    try {
      const response = await fetch('/api/targets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to add target');
      }
      // targetsリストを更新
      await fetchTargets();

      alert(`${name.trim()}さんを追加しました`);
    } catch (error) {
      console.error('Error adding target:', error);
      alert('追加に失敗しました');
    }
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

      selectTarget(null); // 選択を解除
      await fetchTargets(); // リストを更新
      alert(`${selectedTarget.name}さんを削除しました`);
    } catch (error) {
      console.error('Error deleting target:', error);
      alert('削除に失敗しました');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 sm:flex sm:items-center sm:justify-between h-[100px]">
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

      <div className="flex items-center space-x-3 mt-4 sm:mt-0">
        <select
          id="womanSelect"
          value={selectedTargetId?.toString() || ''}
          onChange={handleSelectChange}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">女性を選択...</option>
          {targets.map((target) => (
            <option key={target.id} value={target.id.toString()}>
              {target.name}
            </option>
          ))}
        </select>
        <button
          id="deleteWomanBtn"
          onClick={handleDeleteClick}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        //disabled={!selectedTargetId}
        >
          <FiTrash2 className="w-4 h-4 mr-1" />
          削除
        </button>
        <button
          id="addWomanBtn"
          onClick={handleAddClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center"
        >
          <FiPlus className="w-4 h-4 mr-1" />
          新規追加
        </button>
      </div>
    </header>
  );
}