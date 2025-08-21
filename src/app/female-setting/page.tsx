'use client';

import DefaultLayout from '@/components/layout/DefaultLayout';
import { FiSave } from 'react-icons/fi';
import { useTargetsStore } from '@/store/targets';
import { useEffect } from 'react';
import { useSettingStore } from '@/store/setting';
import { useUserStore } from '@/store/user';

export default function FemaleSetting() {
    const { targets, selectedTargetId, fetchTargets, isLoading: isLoadingTargets } = useTargetsStore();
    const { isLoading: isLoadingUser } = useUserStore();
    
    // 選択された女性のデータを取得
    const selectedTarget = targets.find(t => t.id === selectedTargetId);

    // Zustandストアから状態を取得
    const {
        femaleFormData,
        isSaving,
        setFemaleFormData,
        setIsSaving,
        updateFemaleField,
        resetFemaleForm
    } = useSettingStore();

    // 選択された女性のデータが変更されたら、フォームを更新
    useEffect(() => {
        if (selectedTarget) {
            setFemaleFormData({
                name: selectedTarget.name || '',
                age: selectedTarget.age?.toString() || '',
                job: selectedTarget.job || '',
                hobby: selectedTarget.hobby || '',
                residence: selectedTarget.residence || '',
                workplace: selectedTarget.workplace || '',
                bloodType: selectedTarget.bloodType || '',
                education: selectedTarget.education || '',
                workType: selectedTarget.workType || '',
                holiday: selectedTarget.holiday || '',
                marriageHistory: selectedTarget.marriageHistory || '',
                hasChildren: selectedTarget.hasChildren || '',
                smoking: selectedTarget.smoking || '',
                drinking: selectedTarget.drinking || '',
                livingWith: selectedTarget.livingWith || '',
                marriageIntention: selectedTarget.marriageIntention || '',
                selfIntroduction: selectedTarget.selfIntroduction || ''
            });
        } else {
            // 選択されていない場合はフォームをクリア
            resetFemaleForm();
        }
    }, [selectedTarget, setFemaleFormData, resetFemaleForm]);

    // フォーム入力の処理
    const handleInputChange = (field: string, value: string) => {
        updateFemaleField(field, value);
    };

    // 保存処理
    const handleSave = async () => {
        if (!selectedTarget) {
            alert('女性を選択してください');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/targets', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: selectedTarget.id,
                    name: femaleFormData.name,
                    age: femaleFormData.age,
                    job: femaleFormData.job,
                    hobby: femaleFormData.hobby,
                    residence: femaleFormData.residence,
                    workplace: femaleFormData.workplace,
                    bloodType: femaleFormData.bloodType,
                    education: femaleFormData.education,
                    workType: femaleFormData.workType,
                    holiday: femaleFormData.holiday,
                    marriageHistory: femaleFormData.marriageHistory,
                    hasChildren: femaleFormData.hasChildren,
                    smoking: femaleFormData.smoking,
                    drinking: femaleFormData.drinking,
                    livingWith: femaleFormData.livingWith,
                    marriageIntention: femaleFormData.marriageIntention,
                    selfIntroduction: femaleFormData.selfIntroduction,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update target');
            }

            alert('保存しました');
            await fetchTargets(); // データを更新
        } catch (error) {
            console.error('Error saving data:', error);
            alert('保存に失敗しました');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DefaultLayout>
            <div id="profileScreen" className="w-full p-3 bg-gray-50 overflow-y-auto h-[calc(100dvh-100px)] sm:h-[calc(100dvh-70px)] relative">
                {(isSaving || isLoadingUser || isLoadingTargets) && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-500"></div>
                    </div>
                )}
                
                <div className="bg-white rounded-lg shadow-sm p-3">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                        {selectedTarget ? (
                            <p>{selectedTarget.name}さんのプロフィール設定</p>
                        ) : (
                            <p>相手（女性）のプロフィール設定</p>
                        )}
                    </h2>

                    {!selectedTarget && (
                        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800">女性を選択してください。</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* 名前 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">お名前</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="例: 田中花子"
                                value={femaleFormData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                disabled={!selectedTarget}
                            />
                        </div>

                        {/* 基本情報 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">推定年齢</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="例: 25"
                                    value={femaleFormData.age}
                                    onChange={(e) => handleInputChange('age', e.target.value)}
                                    disabled={!selectedTarget}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">血液型</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={femaleFormData.bloodType}
                                    onChange={(e) => handleInputChange('bloodType', e.target.value)}
                                    disabled={!selectedTarget}
                                >
                                    <option value="">選択してください</option>
                                    <option value="A型">A型</option>
                                    <option value="B型">B型</option>
                                    <option value="O型">O型</option>
                                    <option value="AB型">AB型</option>
                                    <option value="不明">不明</option>
                                </select>
                            </div>
                        </div>

                        {/* 居住地・勤務地 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">居住地（推定）</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="例: 東京都渋谷区"
                                    value={femaleFormData.residence}
                                    onChange={(e) => handleInputChange('residence', e.target.value)}
                                    disabled={!selectedTarget}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">勤務地（推定）</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="例: 東京都新宿区"
                                    value={femaleFormData.workplace}
                                    onChange={(e) => handleInputChange('workplace', e.target.value)}
                                    disabled={!selectedTarget}
                                />
                            </div>
                        </div>

                        {/* 職業・仕事の種類 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">職業（分かれば）</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="例: 看護師"
                                    value={femaleFormData.job}
                                    onChange={(e) => handleInputChange('job', e.target.value)}
                                    disabled={!selectedTarget}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">仕事の種類（推定）</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={femaleFormData.workType}
                                    onChange={(e) => handleInputChange('workType', e.target.value)}
                                    disabled={!selectedTarget}
                                >
                                    <option value="">選択してください</option>
                                    <option value="会社員">会社員</option>
                                    <option value="公務員">公務員</option>
                                    <option value="自営業">自営業</option>
                                    <option value="フリーランス">フリーランス</option>
                                    <option value="経営者">経営者</option>
                                    <option value="学生">学生</option>
                                    <option value="その他">その他</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">学歴（推定）</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={femaleFormData.education}
                                onChange={(e) => handleInputChange('education', e.target.value)}
                                disabled={!selectedTarget}
                            >
                                <option value="">選択してください</option>
                                <option value="高校卒業">高校卒業</option>
                                <option value="専門学校卒業">専門学校卒業</option>
                                <option value="短大卒業">短大卒業</option>
                                <option value="大学卒業">大学卒業</option>
                                <option value="大学院修了">大学院修了</option>
                                <option value="その他">その他</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">休日（推定）</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="例: 土日祝日、平日休み、シフト制"
                                value={femaleFormData.holiday}
                                onChange={(e) => handleInputChange('holiday', e.target.value)}
                                disabled={!selectedTarget}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">趣味・関心事</label>
                            <textarea
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="例: カフェ巡り、読書、ヨガ"
                                value={femaleFormData.hobby}
                                onChange={(e) => handleInputChange('hobby', e.target.value)}
                                disabled={!selectedTarget}
                            ></textarea>
                        </div>

                        {/* ライフスタイル */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">結婚歴（推定）</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={femaleFormData.marriageHistory}
                                    onChange={(e) => handleInputChange('marriageHistory', e.target.value)}
                                    disabled={!selectedTarget}
                                >
                                    <option value="">選択してください</option>
                                    <option value="未婚">未婚</option>
                                    <option value="離婚">離婚</option>
                                    <option value="死別">死別</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">子供の有無（推定）</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={femaleFormData.hasChildren}
                                    onChange={(e) => handleInputChange('hasChildren', e.target.value)}
                                    disabled={!selectedTarget}
                                >
                                    <option value="">選択してください</option>
                                    <option value="いない">いない</option>
                                    <option value="いる（同居）">いる（同居）</option>
                                    <option value="いる（別居）">いる（別居）</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">煙草（推定）</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={femaleFormData.smoking}
                                    onChange={(e) => handleInputChange('smoking', e.target.value)}
                                    disabled={!selectedTarget}
                                >
                                    <option value="">選択してください</option>
                                    <option value="吸わない">吸わない</option>
                                    <option value="時々吸う">時々吸う</option>
                                    <option value="吸う">吸う</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">お酒（推定）</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={femaleFormData.drinking}
                                    onChange={(e) => handleInputChange('drinking', e.target.value)}
                                    disabled={!selectedTarget}
                                >
                                    <option value="">選択してください</option>
                                    <option value="飲まない">飲まない</option>
                                    <option value="時々飲む">時々飲む</option>
                                    <option value="よく飲む">よく飲む</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">一緒に住んでいる人（推定）</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={femaleFormData.livingWith}
                                onChange={(e) => handleInputChange('livingWith', e.target.value)}
                                disabled={!selectedTarget}
                            >
                                <option value="">選択してください</option>
                                <option value="一人暮らし">一人暮らし</option>
                                <option value="家族と同居">家族と同居</option>
                                <option value="友人・知人とシェア">友人・知人とシェア</option>
                                <option value="その他">その他</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">結婚に対する意思（推定）</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={femaleFormData.marriageIntention}
                                onChange={(e) => handleInputChange('marriageIntention', e.target.value)}
                                disabled={!selectedTarget}
                            >
                                <option value="">選択してください</option>
                                <option value="すぐにでもしたい">すぐにでもしたい</option>
                                <option value="2-3年以内にしたい">2-3年以内にしたい</option>
                                <option value="いい人がいればしたい">いい人がいればしたい</option>
                                <option value="今は考えていない">今は考えていない</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">自己紹介</label>
                            <textarea
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="例: こんにちは！カフェ巡りが好きな25歳の看護師です。読書やヨガも趣味で、穏やかな時間を過ごすのが好きです。"
                                value={femaleFormData.selfIntroduction}
                                onChange={(e) => handleInputChange('selfIntroduction', e.target.value)}
                                disabled={!selectedTarget}
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !selectedTarget}
                            className={`px-8 py-3 rounded-lg transition-colors flex items-center ${!isSaving && selectedTarget
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <FiSave className="w-5 h-5 mr-2" />
                            {isSaving ? '保存中...' : '保存'}
                        </button>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}