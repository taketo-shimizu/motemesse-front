'use client';

import DefaultLayout from '@/components/layout/DefaultLayout';
import { FiSave, FiCamera } from 'react-icons/fi';
import { useTargetsStore } from '@/store/targets';
import { useEffect, useState } from 'react';
import { useSettingStore } from '@/store/setting';
import { useUserStore } from '@/store/user';
import ImageUploadForProfile from '@/components/ImageUploadForProfile';
import { ProfileData } from '@/types/profile';
import { useSearchParams, useRouter } from 'next/navigation';

export default function FemaleSetting() {
    const { targets, selectedTargetId, fetchTargets, selectTarget, isLoading: isLoadingTargets } = useTargetsStore();
    const { isLoading: isLoadingUser } = useUserStore();
    const searchParams = useSearchParams();
    const router = useRouter();

    // 新規作成モードかどうかを判定
    const isNewMode = searchParams.get('new') === 'true';
    const nameFromQuery = searchParams.get('name');
    
    // 選択された女性のデータを取得
    const selectedTarget = targets.find(t => t.id === selectedTargetId);

    // Zustandストアから状態を取得
    const {
        femaleFormData,
        isSaving,
        isFemaleAnalyzing,
        setFemaleFormData,
        setIsSaving,
        updateFemaleField,
        resetFemaleForm,
        setIsFemaleAnalyzing,
    } = useSettingStore();

    // 選択された女性のデータが変更されたら、フォームを更新
    useEffect(() => {
        if (isNewMode && nameFromQuery) {
            // 新規作成モードの場合
            setFemaleFormData({
                name: nameFromQuery,
                age: '',
                job: '',
                hobby: '',
                residence: '',
                workplace: '',
                bloodType: '',
                education: '',
                workType: '',
                holiday: '',
                marriageHistory: '',
                hasChildren: '',
                smoking: '',
                drinking: '',
                livingWith: '',
                marriageIntention: '',
                selfIntroduction: ''
            });
        } else if (selectedTarget) {
            // 既存のターゲットを編集する場合
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
    }, [selectedTarget, isNewMode, nameFromQuery, setFemaleFormData, resetFemaleForm]);

    // フォーム入力の処理
    const handleInputChange = (field: string, value: string) => {
        updateFemaleField(field, value);
    };

    // 画像解析結果を受け取って自動入力
    const handleImageAnalyzed = (profileData: ProfileData) => {
        if (profileData.name) updateFemaleField('name', profileData.name);
        if (profileData.age) updateFemaleField('age', profileData.age.toString());
        if (profileData.job) updateFemaleField('job', profileData.job);
        if (profileData.hobby) updateFemaleField('hobby', profileData.hobby);
        if (profileData.residence) updateFemaleField('residence', profileData.residence);
        if (profileData.workplace) updateFemaleField('workplace', profileData.workplace);
        if (profileData.bloodType) updateFemaleField('bloodType', profileData.bloodType);
        if (profileData.education) updateFemaleField('education', profileData.education);
        if (profileData.workType) updateFemaleField('workType', profileData.workType);
        if (profileData.holiday) updateFemaleField('holiday', profileData.holiday);
        if (profileData.marriageHistory) updateFemaleField('marriageHistory', profileData.marriageHistory);
        if (profileData.hasChildren) updateFemaleField('hasChildren', profileData.hasChildren);
        if (profileData.smoking) updateFemaleField('smoking', profileData.smoking);
        if (profileData.drinking) updateFemaleField('drinking', profileData.drinking);
        if (profileData.livingWith) updateFemaleField('livingWith', profileData.livingWith);
        if (profileData.marriageIntention) updateFemaleField('marriageIntention', profileData.marriageIntention);
        if (profileData.selfIntroduction) updateFemaleField('selfIntroduction', profileData.selfIntroduction);
    };

    // 保存処理
    const handleSave = async () => {
        // バリデーション
        if (!femaleFormData.name.trim()) {
            alert('お名前を入力してください');
            return;
        }
        if (!femaleFormData.age.trim()) {
            alert('年齢を入力してください');
            return;
        }

        setIsSaving(true);
        try {
            if (isNewMode) {
                // 新規作成の場合
                const response = await fetch('/api/targets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
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
                    throw new Error('Failed to create target');
                }

                const newTarget = await response.json();
                await fetchTargets();
                selectTarget(newTarget.id);
                alert('保存しました');

                // URLからクエリパラメータを削除
                router.push('/female-setting');
            } else {
                // 既存のターゲットを更新する場合
                if (!selectedTarget) {
                    alert('女性を選択してください');
                    return;
                }

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
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('保存に失敗しました');
        } finally {
            setIsSaving(false);
        }
    };

    // 保存ボタンの有効/無効を判定
    const isFormValid = femaleFormData.name.trim() && femaleFormData.age.trim();

    return (
        <DefaultLayout>
            <div id="profileScreen" className="w-full bg-gradient-to-b from-white to-tapple-pink-pale overflow-y-auto h-[calc(100dvh-100px)] sm:h-[calc(100dvh-70px)] relative">
                {(isSaving || isLoadingUser || isLoadingTargets || isFemaleAnalyzing) && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-tapple-pink"></div>
                    </div>
                )}

                {/* ヘッダー部分 */}
                <div className="bg-gradient-to-r from-tapple-pink to-tapple-pink-light p-4 text-white">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                            <span className="text-lg">👩</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">
                                {isNewMode && nameFromQuery
                                    ? `${nameFromQuery}さんのプロフィール`
                                    : selectedTarget
                                        ? `${selectedTarget.name}さんのプロフィール`
                                        : '相手のプロフィール設定'}
                            </h2>
                            <p className="text-xs opacity-90">相手の情報を入力してください</p>
                        </div>
                    </div>
                </div>

                <div className="p-3">
                    {!selectedTarget && !isNewMode && (
                        <div className="mb-3 p-3 bg-tapple-pink-pale border border-tapple-pink-soft rounded-xl">
                            <p className="text-sm text-tapple-pink font-medium">サイドメニューから女性を選択してください</p>
                        </div>
                    )}

                    {/* スクリーンショットアップロード */}
                    {(selectedTarget || isNewMode) && (
                        <div className="mb-4 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                            <ImageUploadForProfile
                                onImageAnalyzed={handleImageAnalyzed}
                                isAnalyzing={isFemaleAnalyzing}
                                setIsAnalyzing={setIsFemaleAnalyzing}
                            />
                        </div>
                    )}

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
                                    placeholder="例: 田中花子"
                                    value={femaleFormData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    disabled={!selectedTarget && !isNewMode}
                                    required
                                />
                            </div>

                            {/* 年齢・血液型 */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        推定年齢 <span className="text-tapple-pink">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all"
                                        placeholder="例: 25"
                                        value={femaleFormData.age}
                                        onChange={(e) => handleInputChange('age', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">血液型</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all appearance-none bg-white"
                                        value={femaleFormData.bloodType}
                                        onChange={(e) => handleInputChange('bloodType', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
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
                                        value={femaleFormData.residence}
                                        onChange={(e) => handleInputChange('residence', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">勤務地</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all"
                                        placeholder="新宿区"
                                        value={femaleFormData.workplace}
                                        onChange={(e) => handleInputChange('workplace', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
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
                                        placeholder="看護師"
                                        value={femaleFormData.job}
                                        onChange={(e) => handleInputChange('job', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">仕事の種類</label>
                                    <select
                                        className="w-full border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all appearance-none bg-white"
                                        value={femaleFormData.workType}
                                        onChange={(e) => handleInputChange('workType', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
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
                                        value={femaleFormData.education}
                                        onChange={(e) => handleInputChange('education', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
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
                                        value={femaleFormData.holiday}
                                        onChange={(e) => handleInputChange('holiday', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
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
                                    placeholder="カフェ巡り、読書、ヨガ"
                                    value={femaleFormData.hobby}
                                    onChange={(e) => handleInputChange('hobby', e.target.value)}
                                    disabled={!selectedTarget && !isNewMode}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">自己紹介</label>
                                <textarea
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tapple-pink focus:border-transparent transition-all resize-none"
                                    placeholder="こんにちは！よろしくお願いします。"
                                    value={femaleFormData.selfIntroduction}
                                    onChange={(e) => handleInputChange('selfIntroduction', e.target.value)}
                                    disabled={!selectedTarget && !isNewMode}
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
                                        value={femaleFormData.marriageHistory}
                                        onChange={(e) => handleInputChange('marriageHistory', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
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
                                        value={femaleFormData.hasChildren}
                                        onChange={(e) => handleInputChange('hasChildren', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
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
                                        value={femaleFormData.smoking}
                                        onChange={(e) => handleInputChange('smoking', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
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
                                        value={femaleFormData.drinking}
                                        onChange={(e) => handleInputChange('drinking', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
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
                                        value={femaleFormData.livingWith}
                                        onChange={(e) => handleInputChange('livingWith', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
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
                                        value={femaleFormData.marriageIntention}
                                        onChange={(e) => handleInputChange('marriageIntention', e.target.value)}
                                        disabled={!selectedTarget && !isNewMode}
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
                            disabled={isSaving || (!selectedTarget && !isNewMode) || !isFormValid}
                            className={`w-full py-3 rounded-full text-sm font-bold text-white transition-all shadow-md flex items-center justify-center ${
                                !isSaving && (selectedTarget || isNewMode) && isFormValid
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