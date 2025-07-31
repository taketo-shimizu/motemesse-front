'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FiSave } from 'react-icons/fi';

export default function Setting() {
    const { user } = useUser();


    return (
        <DefaultLayout>
            <div id="profileScreen" className="flex-1 bg-gray-50 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="mb-6 text-2xl font-semibold text-gray-800">プロフィール設定</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* 男性側（自分）の情報 */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">あなた（男性）の情報</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
                                    <input type="number" id="maleAge" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 28" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">職業</label>
                                    <input type="text" id="maleJob" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: エンジニア" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">趣味・関心事</label>
                                    <textarea id="maleHobbies" rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 映画鑑賞、料理、旅行"></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">性格・特徴</label>
                                    <textarea id="malePersonality" rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 優しい、面白い、真面目"></textarea>
                                </div>
                            </div>

                            {/* 女性側（相手）の情報 */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">相手（女性）の情報</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">推定年齢</label>
                                    <input type="number" id="femaleAge" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 25" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">職業（分かれば）</label>
                                    <input type="text" id="femaleJob" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 看護師" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">趣味・関心事</label>
                                    <textarea id="femaleHobbies" rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: カフェ巡り、読書、ヨガ"></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">性格・印象</label>
                                    <textarea id="femalePersonality" rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="例: 明るい、優しそう、真面目"></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button 
                                id="saveProfile" 
                                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors flex items-center"
                            >
                                <FiSave className="w-5 h-5 mr-2" />
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}