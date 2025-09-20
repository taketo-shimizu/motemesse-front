'use client';

import DefaultLayout from '@/components/layout/DefaultLayout';
import { useTargetsStore } from '@/store/targets';
import { useEffect, useCallback, useState, useRef } from 'react';
import { useUserStore } from '@/store/user';
import { useChatStore } from '@/store/chat';


export default function Chat() {
  const { targets, selectedTargetId, isLoading: isLoadingTargets } = useTargetsStore();
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
    showIntentOptions,
    setMessage,
    setReplyCandidates,
    setConversations,
    setIsLoading,
    setIsGeneratingInitial,
    setIsLoadingConversations,
    setError,
    setShowCandidates,
    setCurrentFemaleMessage,
    setShowIntentOptions,
    updateReplyCandidate,
    resetChatState
  } = useChatStore();

  // スクリーンショットアップロード関連のstate
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 選択されたターゲットの情報を取得
  const selectedTarget = targets.find(t => t.id === selectedTargetId);

  // 初期化完了の判定
  const isInitializing = isLoadingUser || isLoadingTargets;

  // 会話履歴エリアを最下部にスクロールする関数
  const scrollToBottom = () => {
    const chatArea = document.getElementById('chatArea');
    if (chatArea) {
      // 少し遅延を入れてDOMの更新を待つ
      setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
      }, 100);
    }
  };

  // 会話履歴を取得
  const fetchConversations = useCallback(async () => {
    if (!selectedTargetId) return;

    setIsLoadingConversations(true);
    try {
      const response = await fetch(`/api/conversations?targetId=${selectedTargetId}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
        // 会話履歴を取得後、最下部にスクロール
        scrollToBottom();
      }
    } catch (error) {
      console.error('会話履歴の取得に失敗しました:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [selectedTargetId, setIsLoadingConversations, setConversations]);

  // ターゲットが変更されたら会話履歴を取得
  useEffect(() => {
    if (selectedTargetId) {
      fetchConversations();
      resetChatState();
    }
  }, [selectedTargetId, fetchConversations, resetChatState]);

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
      const response = await fetchWithRetry('/api/proxy/langchain/generate-reply', {
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
      setError('返信候補の生成中にエラーが発生しました。サーバーが起動中の可能性があります。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // リトライ機能付きのfetch関数
  const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 2): Promise<Response> => {
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        console.log(`API呼び出し試行 ${attempt}/${maxRetries + 1}`);
        const response = await fetch(url, options);

        if (response.ok) {
          return response;
        }

        // 500エラーの場合はリトライ、それ以外はそのまま返す
        if (response.status === 500 && attempt <= maxRetries) {
          console.log(`500エラーが発生しました。${3}秒後にリトライします...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        }

        return response;
      } catch (error) {
        console.error(`試行 ${attempt} でエラーが発生:`, error);

        if (attempt <= maxRetries) {
          console.log(`${3}秒後にリトライします...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        }

        throw error;
      }
    }
    throw new Error('All retry attempts failed');
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
      const response = await fetchWithRetry('/api/proxy/langchain/generate-initial-greeting', {
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
      setError('初回挨拶の生成中にエラーが発生しました。サーバーが起動中の可能性があります。もう一度お試しください。');
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

      // 会話保存後、最下部にスクロール
      scrollToBottom();

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

  // スクリーンショットアップロード処理（プロフィールと同じ方式）
  const handleScreenshotUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedTargetId || !user) return;

    setIsUploadingScreenshot(true);
    setError(null);

    try {
      // 画像をBase64に変換
      const imagePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const images = await Promise.all(imagePromises);

      // APIを呼び出し
      const response = await fetch('/api/proxy/screenshot/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images,
          userId: user.id,
          targetId: selectedTargetId
        })
      });

      if (!response.ok) {
        throw new Error('スクリーンショットの解析に失敗しました');
      }

      const result = await response.json();

      // 保存されたメッセージがある場合は会話履歴を再取得
      if (result.savedCount > 0) {
        await fetchConversations();
      }

      // 返信待ちの女性メッセージがある場合は意図選択を表示
      if (result.pendingFemaleMessage) {
        setCurrentFemaleMessage(result.pendingFemaleMessage);
        setShowIntentOptions(true);
      } else if (!result.savedCount && (!result.newMessages || result.newMessages.length === 0)) {
        // 新規メッセージが見つからなかった場合
        setError('新しいメッセージが見つかりませんでした');
      }

      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('スクリーンショットアップロードエラー:', error);
      setError('スクリーンショットの処理中にエラーが発生しました');
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  // テストデータとして残す
  /*const replyCandidates2 = [
    {
      editText: "改めまして、ももさん初めまして！ドライブや旅行が好きとのことですが、最近行かれたお気に入りの場所などありますか？もしよろしければ、今度一緒に都内か千葉でお出かけしませんか？土日なら比較的調整できますが、ご都合いかがでしょう？",
      id: 1,
      isEditing: true,
      text: "改めまして、ももさん初めまして！ドライブや旅行が好きとのことですが、最近行かれたお気に入りの場所などありますか？もしよろしければ、今度一緒に都内か千葉でお出かけしませんか？土日なら比較的調整できますが、ご都合いかがでしょう？"
    },
    {
      editText: "ももさん、改めてこんにちは！僕も買い物やお出かけ好きなので、お話し合いそうで嬉しいです。もしよかったら、都内のカフェか千葉のおすすめスポットで軽くお茶でもどうですか？土日でしたらお時間合わせられますので、ご都合よければ教えてください！",
      id: 2,
      isEditing: false,
      text: "ももさん、改めてこんにちは！僕も買い物やお出かけ好きなので、お話し合いそうで嬉しいです。もしよかったら、都内のカフェか千葉のおすすめスポットで軽くお茶でもどうですか？土日でしたらお時間合わせられますので、ご都合よければ教えてください！"
    },
    {
      editText: "初めまして＆ありがとうございます！共通の趣味が多いですね。千葉だとディズニー系とかもお好きですか？お互い気軽に楽しめそうなドライブかカフェ巡り、今度ご一緒しませんか？土日どちらかご予定どうでしょう？",
      id: 3,
      isEditing: false,
      text: "初めまして＆ありがとうございます！共通の趣味が多いですね。千葉だとディズニー系とかもお好きですか？お互い気軽に楽しめそうなドライブかカフェ巡り、今度ご一緒しませんか？土日どちらかご予定どうでしょう？"
    }
  ]*/


  return (
    <DefaultLayout>
      <div className="grid grid-rows-[auto_1fr_auto] h-[calc(100dvh-60px)] bg-[#f5f5f5] text-sm">
        {(isLoading || isLoadingConversations || isGeneratingInitial || isInitializing) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-tapple-pink"></div>
          </div>
        )}

        {/* ヘッダー */}
        <div className="bg-white shadow-sm p-4">
          <span className="text-base sm:text-lg font-semibold">{selectedTarget ? selectedTarget.name : 'チャット'}</span>
        </div>

        {/* 会話履歴エリア */}
        <div id="chatArea" className="overflow-y-auto p-3 space-y-4">
          {isInitializing ? (
            <div className="text-center text-gray-500">
              初期化中...
            </div>
          ) : !selectedTarget ? (
            <div className="text-center text-gray-500">
              女性を選択してからチャットを開始してください
            </div>
          ) : isLoadingConversations ? (
            <div className="text-center text-gray-500">
              会話履歴を読み込み中...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center space-y-3">
              <p>まだ会話がありません</p>
              <button
                onClick={handleGenerateInitialGreeting}
                disabled={isGeneratingInitial || !selectedTarget}
                className="bg-tapple-pink text-white px-4 py-2 rounded-full font-semibold disabled:opacity-50"
              >
                {isGeneratingInitial ? '生成中...' : '初回挨拶を作成する'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="space-y-3">
                  {/* 女性からのメッセージ */}
                  {conversation.femaleMessage && conversation.femaleMessage.trim() !== '' && (
                    <div className="flex justify-start">
                      <div className="max-w-xs lg:max-w-md">
                        <div className="bg-white rounded-[20px] rounded-tl-[4px] p-3 shadow-sm">
                          <p className="text-xs leading-relaxed whitespace-pre-wrap">{conversation.femaleMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 男性の返信 */}
                  <div className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md">
                      <div className="bg-tapple-pink text-white rounded-[20px] rounded-tr-[4px] p-3 shadow-sm">
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{conversation.maleReply}</p>
                      </div>
                      <button
                        onClick={() => handleCopyMessage(conversation.maleReply)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        コピー
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

        {/* メッセージ入力エリア */}
        <div className="bg-white p-4 h-[80px]">
          <div className="flex items-center space-x-2">
            {/* スクリーンショットアップロードボタン */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleScreenshotUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingScreenshot || !selectedTarget}
              className="p-2 text-gray-600 hover:text-tapple-pink disabled:text-gray-300 transition-colors"
              title="スクリーンショットをアップロード"
            >
              {isUploadingScreenshot ? (
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </button>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder={selectedTarget ? "相手からのメッセージ" : "相手を選択してください"}
              className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-base focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300"
              disabled={isLoading || !selectedTarget}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim() || !selectedTarget}
              className="p-2 text-tapple-pink disabled:text-gray-300"
            >
              {isLoading ? (
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 返信候補オーバーレイ */}
        {showCandidates && replyCandidates.length > 0 && (
          <div className="grid grid-rows-[auto_1fr] absolute bottom-[80px] left-0 right-0 bg-white shadow-2xl max-h-80 overflow-y-auto z-10 rounded-t-3xl p-4">
            <div className="bg-white rounded-t-3xl flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-gray-800">AI返信候補</h3>
              <button
                onClick={() => setShowCandidates(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto">
              {replyCandidates.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className={`relative text-xs rounded-2xl transition-all ${candidate.isEditing
                    ? 'bg-gray-50 ring-2 ring-tapple-pink'
                    : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                  {candidate.isEditing ? (
                    <div className="p-4">
                      <textarea
                        value={candidate.editText}
                        onChange={(e) => handleEditCandidate(candidate.id, e.target.value)}
                        className="w-full border-0 outline-none resize-none bg-transparent leading-relaxed"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex justify-end space-x-2 mt-3">
                        <button
                          onClick={() => {
                            updateReplyCandidate(candidate.id, {
                              isEditing: false,
                              editText: candidate.text
                            });
                          }}
                          className="px-4 py-2 text-gray-600 font-medium"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={() => handleToggleEdit(candidate.id)}
                          className="px-4 py-2 bg-tapple-pink text-white rounded-full font-medium"
                        >
                          保存
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-3">
                          <div className="flex items-center mb-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-tapple-pink text-white text-xs font-bold rounded-full">
                              {index + 1}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">候補 {index + 1}</span>
                          </div>
                          <p
                            className="leading-relaxed text-gray-800 cursor-pointer"
                            onClick={() => handleToggleEdit(candidate.id)}
                          >
                            {candidate.editText || candidate.text}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleToggleEdit(candidate.id)}
                            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleSelectCandidate(candidate)}
                            className="px-4 py-2 bg-tapple-pink text-white font-bold rounded-full font-medium hover:bg-tapple-pink-dark transition-colors"
                          >
                            送信
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}