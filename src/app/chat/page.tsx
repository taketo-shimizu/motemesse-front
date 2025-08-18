'use client';

import DefaultLayout from '@/components/layout/DefaultLayout';
import { useTargetsStore } from '@/store/targets';
import { useEffect } from 'react';
import { useUserStore } from '@/store/user';
import { useChatStore } from '@/store/chat';


export default function Chat() {
  const { targets, selectedTargetId, selectTarget, fetchTargets, isLoading: isLoadingTargets } = useTargetsStore();
  const { user, isLoading: isLoadingUser } = useUserStore();
  const {
    message,
    replyCandidates,
    conversations,
    isLoading,
    isGeneratingInitial,
    isLoadingConversations,
    error,
    showCandidates,
    currentFemaleMessage,
    setMessage,
    setReplyCandidates,
    setConversations,
    setIsLoading,
    setIsGeneratingInitial,
    setIsLoadingConversations,
    setError,
    setShowCandidates,
    setCurrentFemaleMessage,
    updateReplyCandidate,
    resetChatState
  } = useChatStore();

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
      resetChatState();
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
      const candidates = data.replies.map((reply: { id: number; text: string }) => ({
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

  // 初回挨拶メッセージ（あなたからの最初のメッセージ）候補を生成
  const handleGenerateInitialGreeting = async () => {
    if (!user || !selectedTargetId) {
      setError('女性を選択してください');
      return;
    }
    setIsGeneratingInitial(true);
    setError(null);
    try {
      const response = await fetch('/api/proxy/langchain/generate-initial-greeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          selectedTargetId,
          // デフォルトのトーンスタイル
          //type: '軽いノリの敬語'
        })
      });
      if (!response.ok) {
        throw new Error('初回挨拶の生成に失敗しました');
      }
      const data = await response.json();
      const candidates = data.replies.map((reply: { id: number; text: string }) => ({
        ...reply,
        isEditing: false,
        editText: reply.text
      }));
      setReplyCandidates(candidates);
      setShowCandidates(true);
    } catch (error) {
      console.error('初回挨拶の生成に失敗しました:', error);
      setError('初回挨拶の生成中にエラーが発生しました');
    } finally {
      setIsGeneratingInitial(false);
    }
  };

  // 返信候補を編集
  const handleEditCandidate = (id: number, text: string) => {
    updateReplyCandidate(id, { editText: text });
  };

  // 編集モードの切り替え
  const handleToggleEdit = (id: number) => {
    const candidate = replyCandidates.find(c => c.id === id);
    if (candidate) {
      updateReplyCandidate(id, { isEditing: !candidate.isEditing });
    }
  };

  // 返信を確定して会話を保存
  const handleSelectCandidate = async (candidate: typeof replyCandidates[0]) => {
    if (candidate.isEditing) return;

    setIsLoading(true);

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
      resetChatState();

      console.log('会話が保存されました');
    } catch (error) {
      console.error('会話の保存中にエラーが発生しました:', error);
      setError('会話の保存中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // メッセージをコピーする関数
  const handleCopyMessage = async (message: string) => {
    try {
      await navigator.clipboard.writeText(message);
      console.log('メッセージがコピーされました:', message);
    } catch (error) {
      console.error('コピーに失敗しました:', error);
      // フォールバック: 古いブラウザ対応
      const textArea = document.createElement('textarea');
      textArea.value = message;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col h-full relative">
        {(isLoading || isLoadingConversations || isGeneratingInitial ||isLoadingUser || isLoadingTargets) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-500"></div>
          </div>
        )}
        
        {/* ヘッダー */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedTarget ? `${selectedTarget.name}さんとの会話` : 'チャット'}
          </h2>
        </div>

        {/* 会話履歴エリア */}
        <div id="chatArea" className="flex-1 overflow-y-auto p-3 space-y-4 bg-gray-50">
          {!selectedTarget ? (
            <div className="text-center text-gray-500 text-sm">
              女性を選択してからチャットを開始してください
            </div>
          ) : isLoadingConversations ? (
            <div className="text-center text-gray-500 text-sm">
              会話履歴を読み込み中...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-gray-700 text-sm space-y-3">
              <div>まだ会話がありません。あなたからの最初のメッセージを作成しますか？</div>
              <button
                onClick={handleGenerateInitialGreeting}
                disabled={isGeneratingInitial || !selectedTarget}
                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingInitial ? '生成中...' : '初回挨拶を作成する'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="space-y-3">
                  {/* 女性からのメッセージ（空の場合は表示しない） */}
                  {conversation.femaleMessage && conversation.femaleMessage.trim() !== '' && (
                    <div className="flex justify-start">
                      <div className="max-w-xs lg:max-w-md bg-pink-gradient rounded-2xl shadow p-3">
                        <div className="text-xs text-gray-500 mb-1">{conversation.target.name}</div>
                        <div className="text-gray-800">{conversation.femaleMessage}</div>
                      </div>
                    </div>
                  )}

                  {/* 男性の返信 */}
                  <div className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md">
                      <div className="bg-gray-gradient text-gray-800 rounded-2xl shadow-sm p-3">
                        <div className="text-xs text-gray-500 mb-1">あなた</div>
                        <div>{conversation.maleReply}</div>
                      </div>
                      <button
                        onClick={() => handleCopyMessage(conversation.maleReply)}
                        className="mt-1 text-xs text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        コピーする
                      </button>
                    </div>
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
              返信候補（クリックして編集）
            </h3>
            <div className="space-y-3">
              {replyCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${candidate.isEditing
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100'
                    : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-blue-500 hover:-translate-y-1 hover:shadow-lg'
                    }`}
                  style={{
                    boxShadow: candidate.isEditing
                      ? '0 4px 12px rgba(34, 197, 94, 0.15)'
                      : '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {candidate.isEditing ? (
                    <div className="pr-20">
                      <textarea
                        value={candidate.editText}
                        onChange={(e) => handleEditCandidate(candidate.id, e.target.value)}
                        className="w-full border-0 outline-none resize-none bg-transparent text-gray-800"
                        rows={3}
                        autoFocus
                        style={{ minHeight: '60px' }}
                      />
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => handleToggleEdit(candidate.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          <i className="fas fa-check mr-1"></i>保存
                        </button>
                        <button
                          onClick={() => {
                            // 編集をキャンセルして元のテキストに戻す
                            updateReplyCandidate(candidate.id, {
                              isEditing: false,
                              editText: candidate.text
                            });
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          <i className="fas fa-times mr-1"></i>キャンセル
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pr-20">
                      <div
                        className="text-gray-800 cursor-pointer"
                        onClick={() => handleToggleEdit(candidate.id)}
                      >
                        {candidate.editText || candidate.text}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCandidate(candidate);
                        }}
                        className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1 rounded text-sm transition-all duration-200 transform hover:scale-105"
                        style={{
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        <i className="fas fa-check mr-1"></i>確定
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* メッセージ入力エリア */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
          <div className="flex space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={selectedTarget ? "女性からのメッセージを入力" : "女性を選択してください"}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || !selectedTarget}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim() || !selectedTarget}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '生成中..' : '送信'}
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}