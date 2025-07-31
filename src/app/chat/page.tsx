'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import DefaultLayout from '@/components/layout/DefaultLayout';

export default function Chat() {
  const { user } = useUser();


  return (
    <DefaultLayout>
      <div id="chatArea" className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="text-center text-gray-500 text-sm">
          女性からのメッセージを入力して、AI返信候補を生成しましょう
        </div>
      </div>

      <div id="replyCandidates" className="hidden bg-white border-t border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">返信候補（クリックして編集）</h3>
        <div id="candidatesList" className="space-y-3"></div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            id="messageInput"
            placeholder="女性からのメッセージを入力してください..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            id="sendBtn"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            送信
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
}