'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { useTargetsStore } from '@/store/targets';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/user';

interface Reply {
  id: number;
  text: string;
}

interface ReplyCandidate extends Reply {
  isEditing?: boolean;
  editText?: string;
}

interface Conversation {
  id: number;
  femaleMessage: string;
  maleReply: string;
  createdAt: string;
  target: {
    name: string;
  };
}

export default function Chat() {
  const { targets, selectedTargetId, selectTarget, fetchTargets } = useTargetsStore();
  const { user } = useUserStore();

  const [message, setMessage] = useState('');
  const [replyCandidates, setReplyCandidates] = useState<ReplyCandidate[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCandidates, setShowCandidates] = useState(false);
  const [currentFemaleMessage, setCurrentFemaleMessage] = useState('');

  // 選択されたターゲットの情報を取得
  const selectedTarget = targets.find(t => t.id === selectedTargetId);

  // 会話履歴を取得
  const fetchConversations = async () => {
    if (!selectedTargetId) return;

    setIsLoadingConversations(true);
    try {
      const response = await fetch(`/api/conversations?targetId=${selectedTargetId}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('会話履歴の取得に失敗しました:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // ターゲットが変更されたら会話履歴を取得
  useEffect(() => {
    if (selectedTargetId) {
      fetchConversations();
      setShowCandidates(false);
      setReplyCandidates([]);
      setMessage('');
    }
  }, [selectedTargetId]);

  // 返信候補を生成
  const handleSendMessage = async () => {
    if (!user || !selectedTargetId || !message.trim()) {
      setError('メッセージを入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentFemaleMessage(message.trim());

    try {
      const response = await fetch('/api/proxy/langchain/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          selectedTargetId,
          message: message.trim()
        })
      });

      if (!response.ok) {
        throw new Error('返信候補の生成に失敗しました');
      }

      const data = await response.json();

      // 返信候補を表示
      const candidates = data.replies.map((reply: Reply) => ({
        ...reply,
        isEditing: false,
        editText: reply.text
      }));

      setReplyCandidates(candidates);
      setShowCandidates(true);
      setMessage(''); // 入力欄をクリア
    } catch (error) {
      console.error('エラーが発生しました:', error);
      setError('返信候補の生成中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 返信候補を編集
  const handleEditCandidate = (id: number, text: string) => {
    setReplyCandidates(prev =>
      prev.map(candidate =>
        candidate.id === id
          ? { ...candidate, editText: text }
          : candidate
      )
    );
  };

  // 編集モードの切り替え
  const handleToggleEdit = (id: number) => {
    setReplyCandidates(prev =>
      prev.map(candidate =>
        candidate.id === id
          ? { ...candidate, isEditing: !candidate.isEditing }
          : candidate
      )
    );
  };

  // 返信を確定して会話を保存
  const handleSelectCandidate = async (candidate: ReplyCandidate) => {
    if (candidate.isEditing) return;

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetId: selectedTargetId,
          femaleMessage: currentFemaleMessage,
          maleReply: candidate.editText || candidate.text
        })
      });

      if (!response.ok) {
        throw new Error('会話の保存に失敗しました');
      }

      // 会話履歴を再取得
      await fetchConversations();

      // 返信候補をクリア
      setShowCandidates(false);
      setReplyCandidates([]);
      setCurrentFemaleMessage('');

      console.log('会話が保存されました');
    } catch (error) {
      console.error('会話の保存中にエラーが発生しました:', error);
      setError('会話の保存中にエラーが発生しました');
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col h-full">
        {/* ヘッダー */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedTarget ? `${selectedTarget.name}さんとの会話` : 'チャット'}
          </h2>
          {!selectedTarget && (
            <p className="text-sm text-gray-500 mt-1">女性を選択してからチャットを開始してください</p>
          )}
        </div>

        {/* 会話履歴エリア */}
        <div id="chatArea" className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {!selectedTarget ? (
            <div className="text-center text-gray-500 text-sm">
              女性を選択してからチャットを開始してください
            </div>
          ) : isLoadingConversations ? (
            <div className="text-center text-gray-500 text-sm">
              会話履歴を読み込み中...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-gray-500 text-sm">
              まだ会話がありません。女性からのメッセージを入力して、AI返信候補を生成しましょう
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="space-y-3">
                  {/* 女性からのメッセージ */}
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md bg-pinkCustom rounded-lg shadow p-3">
                      <div className="text-gray-800">{conversation.femaleMessage}</div>
                    </div>
                  </div>

                  {/* 男性の返信 */}
                  <div className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md bg-blue-500 text-white rounded-lg shadow p-3">
                      <div className="text-xs text-blue-100 mb-1">あなた</div>
                      <div>{conversation.maleReply}</div>
                    </div>
                  </div>

                  {/* タイムスタンプ */}
                  <div className="text-xs text-gray-400 text-center">
                    {new Date(conversation.createdAt).toLocaleString('ja-JP')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* 返信候補表示エリア */}
        {showCandidates && replyCandidates.length > 0 && (
          <div className="bg-white border-t border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              返信候補（クリックして確定、編集ボタンで編集）
            </h3>
            <div className="space-y-3">
              {replyCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  {candidate.isEditing ? (
                    <textarea
                      value={candidate.editText}
                      onChange={(e) => handleEditCandidate(candidate.id, e.target.value)}
                      onBlur={() => handleToggleEdit(candidate.id)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      autoFocus
                    />
                  ) : (
                    <div>
                      <p className="text-gray-800 mb-2">{candidate.editText || candidate.text}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleEdit(candidate.id)}
                          className="text-sm text-blue-500 hover:text-blue-600"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleSelectCandidate(candidate)}
                          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          この返信を確定
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* メッセージ入力エリア */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={selectedTarget ? "女性からのメッセージを入力してください..." : "女性を選択してください"}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || !selectedTarget}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim() || !selectedTarget}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '生成中...' : '返信候補を生成'}
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}