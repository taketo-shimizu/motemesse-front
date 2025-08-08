'use client';

import DefaultLayout from '@/components/layout/DefaultLayout';
import { FiSave } from 'react-icons/fi';
import { useTargetsStore } from '@/store/targets';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/user';

export default function Setting() {

    const { targets, selectedTargetId, selectTarget, fetchTargets } = useTargetsStore();
    const { user, updateUser } = useUserStore();
    console.log(user);
    // 選択された女性のデータを取得
    const selectedTarget = targets.find(t => t.id === selectedTargetId);

    // フォームの状態管理（男性用）
    const [maleFormData, setMaleFormData] = useState({
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

    // フォームの状態管理（女性用）
    const [femaleFormData, setFemaleFormData] = useState({
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

    const [isSaving, setIsSaving] = useState(false);

    // ユーザー（男性）のデータが変更されたら、フォームを更新
    useEffect(() => {
        if (user) {
            setMaleFormData({
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
    }, [user]);

    // 選択された女性のデータが変更されたら、フォームを更新
    useEffect(() => {
        if (selectedTarget) {
            setFemaleFormData({
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
            setFemaleFormData({
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
        }
    }, [selectedTarget]);

    // フォーム入力の処理（男性用）
    const handleMaleInputChange = (field: string, value: string) => {
        setMaleFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // フォーム入力の処理（女性用）
    const handleFemaleInputChange = (field: string, value: string) => {
        setFemaleFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 保存処理
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const promises = [];

            // 男性の情報を保存
            if (user) {
                promises.push(
                    updateUser({
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
                    })
                );
            }

            // 女性の情報を保存（選択されている場合）
            if (selectedTarget) {
                promises.push(
                    fetch('/api/targets', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: selectedTarget.id,
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
                    }).then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to update target');
                        }
                        return response.json();
                    })
                );
            }

            await Promise.all(promises);

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
            <div id="profileScreen" className="flex-1 bg-gray-50 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="mb-6 text-2xl font-semibold text-gray-800">プロフィール設定</h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* 男性側（自分）の情報 */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">あなた（男性）の情報</h3>

                                {/* 基本情報 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
                                        <input
                                            type="number"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="例: 28"
                                            value={maleFormData.age}
                                            onChange={(e) => handleMaleInputChange('age', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">血液型</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={maleFormData.bloodType}
                                            onChange={(e) => handleMaleInputChange('bloodType', e.target.value)}
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
                                            onChange={(e) => handleMaleInputChange('residence', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">勤務地</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="例: 東京都新宿区"
                                            value={maleFormData.workplace}
                                            onChange={(e) => handleMaleInputChange('workplace', e.target.value)}
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
                                            onChange={(e) => handleMaleInputChange('job', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">仕事の種類</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={maleFormData.workType}
                                            onChange={(e) => handleMaleInputChange('workType', e.target.value)}
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
                                        onChange={(e) => handleMaleInputChange('education', e.target.value)}
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
                                        onChange={(e) => handleMaleInputChange('holiday', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">趣味・関心事</label>
                                    <textarea
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="例: 映画鑑賞、料理、旅行"
                                        value={maleFormData.hobby}
                                        onChange={(e) => handleMaleInputChange('hobby', e.target.value)}
                                    ></textarea>
                                </div>

                                {/* ライフスタイル */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">結婚歴</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={maleFormData.marriageHistory}
                                            onChange={(e) => handleMaleInputChange('marriageHistory', e.target.value)}
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
                                            onChange={(e) => handleMaleInputChange('hasChildren', e.target.value)}
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
                                            onChange={(e) => handleMaleInputChange('smoking', e.target.value)}
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
                                            onChange={(e) => handleMaleInputChange('drinking', e.target.value)}
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
                                        onChange={(e) => handleMaleInputChange('livingWith', e.target.value)}
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
                                        onChange={(e) => handleMaleInputChange('marriageIntention', e.target.value)}
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
                                        onChange={(e) => handleMaleInputChange('selfIntroduction', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            {/* 女性側（相手）の情報 */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">
                                    相手（女性）の情報
                                    {selectedTarget && (
                                        <span className="text-sm text-gray-500 ml-2">- {selectedTarget.name}さん</span>
                                    )}
                                </h3>

                                {!selectedTarget && (
                                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-yellow-800">女性を選択してから設定を行ってください。</p>
                                    </div>
                                )}

                                {/* 基本情報 */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">推定年齢</label>
                                        <input
                                            type="number"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="例: 25"
                                            value={femaleFormData.age}
                                            onChange={(e) => handleFemaleInputChange('age', e.target.value)}
                                            disabled={!selectedTarget}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">血液型</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={femaleFormData.bloodType}
                                            onChange={(e) => handleFemaleInputChange('bloodType', e.target.value)}
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
                                            onChange={(e) => handleFemaleInputChange('residence', e.target.value)}
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
                                            onChange={(e) => handleFemaleInputChange('workplace', e.target.value)}
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
                                            onChange={(e) => handleFemaleInputChange('job', e.target.value)}
                                            disabled={!selectedTarget}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">仕事の種類（推定）</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={femaleFormData.workType}
                                            onChange={(e) => handleFemaleInputChange('workType', e.target.value)}
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
                                        onChange={(e) => handleFemaleInputChange('education', e.target.value)}
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
                                        onChange={(e) => handleFemaleInputChange('holiday', e.target.value)}
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
                                        onChange={(e) => handleFemaleInputChange('hobby', e.target.value)}
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
                                            onChange={(e) => handleFemaleInputChange('marriageHistory', e.target.value)}
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
                                            onChange={(e) => handleFemaleInputChange('hasChildren', e.target.value)}
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
                                            onChange={(e) => handleFemaleInputChange('smoking', e.target.value)}
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
                                            onChange={(e) => handleFemaleInputChange('drinking', e.target.value)}
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
                                        onChange={(e) => handleFemaleInputChange('livingWith', e.target.value)}
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
                                        onChange={(e) => handleFemaleInputChange('marriageIntention', e.target.value)}
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
                                        onChange={(e) => handleFemaleInputChange('selfIntroduction', e.target.value)}
                                        disabled={!selectedTarget}
                                    ></textarea>
                                </div>
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
            </div>
        </DefaultLayout>
    );
}