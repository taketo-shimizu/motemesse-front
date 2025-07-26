'use client'

import { useState } from 'react'

export default function Home() {
  const [message] = useState('Hello World from モテメッセ')
  const [apiMessage, setApiMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchApiMessage = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/hello')
      const data = await response.json()
      setApiMessage(data.message)
    } catch (error) {
      console.error('API接続エラー:', error)
      setApiMessage('APIに接続できませんでした')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl bg-base-100 shadow-2xl">
        <div className="card-body text-center">
          <h1 className="text-5xl font-bold text-primary mb-4">モテメッセ</h1>
          <div className="divider"></div>
          
          <div className="py-8">
            <h2 className="text-3xl font-semibold text-base-content mb-8">
              {message}
            </h2>
            
            <button 
              className={`btn btn-primary btn-lg ${loading ? 'loading' : ''}`}
              onClick={fetchApiMessage}
              disabled={loading}
            >
              {loading ? 'APIに接続中...' : 'APIからメッセージを取得'}
            </button>
            
            {apiMessage && (
              <div className="alert alert-success mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg">{apiMessage}</span>
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">ステータス</div>
                <div className="stat-value text-primary">準備完了</div>
                <div className="stat-desc">アプリケーションが正常に起動しました</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}