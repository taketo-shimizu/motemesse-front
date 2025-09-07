'use client';

import DefaultLayout from '@/components/layout/DefaultLayout';
import { FiSave, FiCamera } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/user';
import { useSettingStore } from '@/store/setting';
import { useTargetsStore } from '@/store/targets';
import ImageUploadForProfile from '@/components/ImageUploadForProfile';
import { ProfileData } from '@/types/profile';

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

    // 画像解析中のステート
    const [isAnalyzing, setIsAnalyzing] = useState(false);

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

    // 画像解析結果を受け取って自動入力
    const handleImageAnalyzed = (profileData: ProfileData) => {
        if (profileData.name) updateMaleField('name', profileData.name);
        if (profileData.age) updateMaleField('age', profileData.age.toString());
        if (profileData.job) updateMaleField('job', profileData.job);
        if (profileData.hobby) updateMaleField('hobby', profileData.hobby);
        if (profileData.residence) updateMaleField('residence', profileData.residence);
        if (profileData.workplace) updateMaleField('workplace', profileData.workplace);
        if (profileData.bloodType) updateMaleField('bloodType', profileData.bloodType);
        if (profileData.education) updateMaleField('education', profileData.education);
        if (profileData.workType) updateMaleField('workType', profileData.workType);
        if (profileData.holiday) updateMaleField('holiday', profileData.holiday);
        if (profileData.marriageHistory) updateMaleField('marriageHistory', profileData.marriageHistory);
        if (profileData.hasChildren) updateMaleField('hasChildren', profileData.hasChildren);
        if (profileData.smoking) updateMaleField('smoking', profileData.smoking);
        if (profileData.drinking) updateMaleField('drinking', profileData.drinking);
        if (profileData.livingWith) updateMaleField('livingWith', profileData.livingWith);
        if (profileData.marriageIntention) updateMaleField('marriageIntention', profileData.marriageIntention);
        if (profileData.selfIntroduction) updateMaleField('selfIntroduction', profileData.selfIntroduction);
    };

    // 保存処理
    const handleSave = async () => {
        // バリデーション
        if (!maleFormData.name.trim()) {
            alert('お名前を入力してください');
            return;
        }
        if (!maleFormData.age.trim()) {
            alert('年齢を入力してください');
            return;
        }

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

    // 保存ボタンの有効/無効を判定
    const isFormValid = maleFormData.name.trim() && maleFormData.age.trim();

    return (
        <DefaultLayout>
            <div id="profileScreen" className="w-full bg-gradient-to-b from-white to-tapple-pink-pale overflow-y-auto relative h-[calc(100dvh-100px)] sm:h-[calc(100dvh-70px)]">
                {(isSaving || isLoadingUser || isLoadingTargets || isAnalyzing) && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-tapple-pink"></div>
                    </div>
                )}

                {/* ヘッダー部分 */}
                <div className="bg-gradient-to-r from-tapple-pink to-tapple-pink-light p-4 text-white">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                            <span className="text-lg">👤</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">プロフィール設定</h2>
                            <p className="text-xs opacity-90">あなたの情報を入力してください</p>
                        </div>
                    </div>
                </div>

                <div className="p-3">
                    {/* スクリーンショットアップロード */}
                    <div className="mb-4 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                        <div className="flex items-center mb-2">
                            <FiCamera className="w-4 h-4 text-tapple-pink mr-2" />
                            <h3 className="text-sm font-medium text-gray-800">スクリーンショットから自動入力</h3>
                        </div>
                        <ImageUploadForProfile
                            onImageAnalyzed={handleImageAnalyzed}
                            isAnalyzing={isAnalyzing}
                            setIsAnalyzing={setIsAnalyzing}
                        />
                    </div>

                    {/* 基本情報セクション */}
                    <div className="bg-white rounded-xl p-4 shadow-sm mb-3 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-tapple-pink-pale rounded-full flex items-center justify-center mr-2 text-xs">
                                <span className="text-tapple-pink">1</span>
                            </span>
                            基本情報
                        </h3>
                        <div className="space-y-3">
                            {/* 名前 */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    お名前 <span className="text-tapple-pink">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all"
                                    placeholder="例: 田中太郎"
                                    value={maleFormData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    required
                                />
                            </div>

                            {/* 年齢・血液型 */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        年齢 <span className="text-tapple-pink">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all"
                                        placeholder="例: 28"
                                        value={maleFormData.age}
                                        onChange={(e) => handleInputChange('age', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">血液型</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all appearance-none bg-white"
                                        value={maleFormData.bloodType}
                                        onChange={(e) => handleInputChange('bloodType', e.target.value)}
                                    >
                                        <option value="">選択</option>
                                        <option value="A型">A型</option>
                                        <option value="B型">B型</option>
                                        <option value="O型">O型</option>
                                        <option value="AB型">AB型</option>
                                        <option value="不明">不明</option>
                                    </select>
                                </div>
                            </div>

                            {/* 居住地・勤務地 */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">居住地</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all"
                                        placeholder="東京都"
                                        value={maleFormData.residence}
                                        onChange={(e) => handleInputChange('residence', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">勤務地</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all"
                                        placeholder="新宿区"
                                        value={maleFormData.workplace}
                                        onChange={(e) => handleInputChange('workplace', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 仕事・学歴セクション */}
                    <div className="bg-white rounded-xl p-4 shadow-sm mb-3 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-tapple-pink-pale rounded-full flex items-center justify-center mr-2 text-xs">
                                <span className="text-tapple-pink">2</span>
                            </span>
                            仕事・学歴
                        </h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">職業</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all"
                                        placeholder="エンジニア"
                                        value={maleFormData.job}
                                        onChange={(e) => handleInputChange('job', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">仕事の種類</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all appearance-none bg-white"
                                        value={maleFormData.workType}
                                        onChange={(e) => handleInputChange('workType', e.target.value)}
                                    >
                                        <option value="">選択</option>
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

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">学歴</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all appearance-none bg-white"
                                        value={maleFormData.education}
                                        onChange={(e) => handleInputChange('education', e.target.value)}
                                    >
                                        <option value="">選択</option>
                                        <option value="高校卒業">高校卒</option>
                                        <option value="専門学校卒業">専門卒</option>
                                        <option value="短大卒業">短大卒</option>
                                        <option value="大学卒業">大学卒</option>
                                        <option value="大学院修了">院卒</option>
                                        <option value="その他">その他</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">休日</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all"
                                        placeholder="土日祝"
                                        value={maleFormData.holiday}
                                        onChange={(e) => handleInputChange('holiday', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 趣味・性格セクション */}
                    <div className="bg-white rounded-xl p-4 shadow-sm mb-3 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-tapple-pink-pale rounded-full flex items-center justify-center mr-2 text-xs">
                                <span className="text-tapple-pink">3</span>
                            </span>
                            趣味・性格
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">趣味・関心事</label>
                                <textarea
                                    rows={2}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all resize-none"
                                    placeholder="映画、料理、旅行"
                                    value={maleFormData.hobby}
                                    onChange={(e) => handleInputChange('hobby', e.target.value)}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">自己紹介</label>
                                <textarea
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all resize-none"
                                    placeholder="はじめまして！よろしくお願いします。"
                                    value={maleFormData.selfIntroduction}
                                    onChange={(e) => handleInputChange('selfIntroduction', e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* ライフスタイルセクション */}
                    <div className="bg-white rounded-xl p-4 shadow-sm mb-3 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                            <span className="w-6 h-6 bg-tapple-pink-pale rounded-full flex items-center justify-center mr-2 text-xs">
                                <span className="text-tapple-pink">4</span>
                            </span>
                            ライフスタイル
                        </h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">結婚歴</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all appearance-none bg-white"
                                        value={maleFormData.marriageHistory}
                                        onChange={(e) => handleInputChange('marriageHistory', e.target.value)}
                                    >
                                        <option value="">選択</option>
                                        <option value="未婚">未婚</option>
                                        <option value="離婚">離婚</option>
                                        <option value="死別">死別</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">子供</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all appearance-none bg-white"
                                        value={maleFormData.hasChildren}
                                        onChange={(e) => handleInputChange('hasChildren', e.target.value)}
                                    >
                                        <option value="">選択</option>
                                        <option value="いない">いない</option>
                                        <option value="いる（同居）">同居</option>
                                        <option value="いる（別居）">別居</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">煙草</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all appearance-none bg-white"
                                        value={maleFormData.smoking}
                                        onChange={(e) => handleInputChange('smoking', e.target.value)}
                                    >
                                        <option value="">選択</option>
                                        <option value="吸わない">吸わない</option>
                                        <option value="時々吸う">時々</option>
                                        <option value="吸う">吸う</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">お酒</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all appearance-none bg-white"
                                        value={maleFormData.drinking}
                                        onChange={(e) => handleInputChange('drinking', e.target.value)}
                                    >
                                        <option value="">選択</option>
                                        <option value="飲まない">飲まない</option>
                                        <option value="時々飲む">時々</option>
                                        <option value="よく飲む">よく飲む</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">同居人</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all appearance-none bg-white"
                                        value={maleFormData.livingWith}
                                        onChange={(e) => handleInputChange('livingWith', e.target.value)}
                                    >
                                        <option value="">選択</option>
                                        <option value="一人暮らし">一人</option>
                                        <option value="家族と同居">家族</option>
                                        <option value="友人・知人とシェア">シェア</option>
                                        <option value="その他">その他</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">結婚願望</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all appearance-none bg-white"
                                        value={maleFormData.marriageIntention}
                                        onChange={(e) => handleInputChange('marriageIntention', e.target.value)}
                                    >
                                        <option value="">選択</option>
                                        <option value="すぐにでもしたい">すぐに</option>
                                        <option value="2-3年以内にしたい">2-3年内</option>
                                        <option value="いい人がいればしたい">いい人がいれば</option>
                                        <option value="今は考えていない">考えていない</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 保存ボタン */}
                    <div className="pb-4 px-3">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !isFormValid}
                            className={`w-full py-3 rounded-full text-sm font-bold text-white transition-all shadow-md flex items-center justify-center ${
                                !isSaving && isFormValid
                                    ? 'bg-gradient-to-r from-tapple-pink to-tapple-pink-light active:from-tapple-pink-dark active:to-tapple-pink'
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            <FiSave className="w-4 h-4 mr-2" />
                            {isSaving ? '保存中...' : 'プロフィールを保存'}
                        </button>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}