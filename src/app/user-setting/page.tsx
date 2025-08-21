'use client';

import DefaultLayout from '@/components/layout/DefaultLayout';
import { FiSave } from 'react-icons/fi';
import { useEffect } from 'react';
import { useUserStore } from '@/store/user';
import { useSettingStore } from '@/store/setting';
import { useTargetsStore } from '@/store/targets';

export default function MaleSetting() {
    const { user, updateUser, isLoading: isLoadingUser } = useUserStore();
    const { isLoading: isLoadingTargets } = useTargetsStore();
    
    // Zustandストアから状態を取得
    const {
        maleFormData,
        isSaving,
        setMaleFormData,
        setIsSaving,
        updateMaleField,
    } = useSettingStore();

    // ユーザー（男性）のデータが変更されたら、フォームを更新
    useEffect(() => {
        if (user) {
            setMaleFormData({
                name: user.name || '',
                age: user.age?.toString() || '',
                job: user.job || '',
                hobby: user.hobby || '',
                residence: user.residence || '',
                workplace: user.workplace || '',
                bloodType: user.bloodType || '',
                education: user.education || '',
                workType: user.workType || '',
                holiday: user.holiday || '',
                marriageHistory: user.marriageHistory || '',
                hasChildren: user.hasChildren || '',
                smoking: user.smoking || '',
                drinking: user.drinking || '',
                livingWith: user.livingWith || '',
                marriageIntention: user.marriageIntention || '',
                selfIntroduction: user.selfIntroduction || ''
            });
        }
    }, [user, setMaleFormData]);

    // フォーム入力の処理
    const handleInputChange = (field: string, value: string) => {
        updateMaleField(field, value);
    };

    // 保存処理
    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (user) {
                await updateUser({
                    name: maleFormData.name,
                    age: maleFormData.age,
                    job: maleFormData.job,
                    hobby: maleFormData.hobby,
                    residence: maleFormData.residence,
                    workplace: maleFormData.workplace,
                    bloodType: maleFormData.bloodType,
                    education: maleFormData.education,
                    workType: maleFormData.workType,
                    holiday: maleFormData.holiday,
                    marriageHistory: maleFormData.marriageHistory,
                    hasChildren: maleFormData.hasChildren,
                    smoking: maleFormData.smoking,
                    drinking: maleFormData.drinking,
                    livingWith: maleFormData.livingWith,
                    marriageIntention: maleFormData.marriageIntention,
                    selfIntroduction: maleFormData.selfIntroduction,
                });
                alert('保存しました');
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('保存に失敗しました');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DefaultLayout>
            <div id="profileScreen" className="w-full p-3 bg-gray-50 overflow-y-auto relative h-[calc(100dvh-100px)] sm:h-[calc(100dvh-70px)] overflow-y-auto">
                {(isSaving || isLoadingUser || isLoadingTargets) && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-500"></div>
                    </div>
                )}
                
                <div className="bg-white rounded-lg shadow-sm p-3">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-800">あなたのプロフィール設定</h2>

                    <div className="space-y-4">
                        {/* 名前 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">お名前</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="例: 田中太郎"
                                value={maleFormData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </div>

                        {/* 基本情報 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="例: 28"
                                    value={maleFormData.age}
                                    onChange={(e) => handleInputChange('age', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">血液型</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={maleFormData.bloodType}
                                    onChange={(e) => handleInputChange('bloodType', e.target.value)}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">居住地</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="例: 東京都渋谷区"
                                    value={maleFormData.residence}
                                    onChange={(e) => handleInputChange('residence', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">勤務地</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="例: 東京都新宿区"
                                    value={maleFormData.workplace}
                                    onChange={(e) => handleInputChange('workplace', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 職業・仕事の種類 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">職業</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="例: エンジニア"
                                    value={maleFormData.job}
                                    onChange={(e) => handleInputChange('job', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">仕事の種類</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={maleFormData.workType}
                                    onChange={(e) => handleInputChange('workType', e.target.value)}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">学歴</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={maleFormData.education}
                                onChange={(e) => handleInputChange('education', e.target.value)}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">休日</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="例: 土日祝日、平日休み、シフト制"
                                value={maleFormData.holiday}
                                onChange={(e) => handleInputChange('holiday', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">趣味・関心事</label>
                            <textarea
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="例: 映画鑑賞、料理、旅行"
                                value={maleFormData.hobby}
                                onChange={(e) => handleInputChange('hobby', e.target.value)}
                            ></textarea>
                        </div>

                        {/* ライフスタイル */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">結婚歴</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={maleFormData.marriageHistory}
                                    onChange={(e) => handleInputChange('marriageHistory', e.target.value)}
                                >
                                    <option value="">選択してください</option>
                                    <option value="未婚">未婚</option>
                                    <option value="離婚">離婚</option>
                                    <option value="死別">死別</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">子供の有無</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={maleFormData.hasChildren}
                                    onChange={(e) => handleInputChange('hasChildren', e.target.value)}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">煙草</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={maleFormData.smoking}
                                    onChange={(e) => handleInputChange('smoking', e.target.value)}
                                >
                                    <option value="">選択してください</option>
                                    <option value="吸わない">吸わない</option>
                                    <option value="時々吸う">時々吸う</option>
                                    <option value="吸う">吸う</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">お酒</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={maleFormData.drinking}
                                    onChange={(e) => handleInputChange('drinking', e.target.value)}
                                >
                                    <option value="">選択してください</option>
                                    <option value="飲まない">飲まない</option>
                                    <option value="時々飲む">時々飲む</option>
                                    <option value="よく飲む">よく飲む</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">一緒に住んでいる人</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={maleFormData.livingWith}
                                onChange={(e) => handleInputChange('livingWith', e.target.value)}
                            >
                                <option value="">選択してください</option>
                                <option value="一人暮らし">一人暮らし</option>
                                <option value="家族と同居">家族と同居</option>
                                <option value="友人・知人とシェア">友人・知人とシェア</option>
                                <option value="その他">その他</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">結婚に対する意思</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={maleFormData.marriageIntention}
                                onChange={(e) => handleInputChange('marriageIntention', e.target.value)}
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
                                placeholder="例: はじめまして！音楽と料理が好きな28歳のエンジニアです。映画を見ながらお話しできたらいいですね。"
                                value={maleFormData.selfIntroduction}
                                onChange={(e) => handleInputChange('selfIntroduction', e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-8 py-3 rounded-lg transition-colors flex items-center ${!isSaving
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