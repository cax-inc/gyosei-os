'use client'

import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/magic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, next: '/onboard/questions' }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'エラーが発生しました')
      setLoading(false)
      return
    }

    setLoading(false)
    setSent(true)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(150deg, #eef2ff 0%, #f0fdf4 50%, #fdf4ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Inter','Helvetica Neue',Arial,'Hiragino Sans',sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* バッジ */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
            padding: '6px 16px', borderRadius: 100,
            fontSize: 12, fontWeight: 700, color: '#6366f1', letterSpacing: '0.5px',
          }}>
            行政書士専用 Webサービス
          </span>
        </div>

        {/* ヘッドライン */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{
            fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 800,
            color: '#1e1b4b', letterSpacing: '-1.5px', lineHeight: 1.2, marginBottom: 14,
          }}>
            行政書士のWeb、<br />すべておまかせ。
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7 }}>
            サイト・ドメイン・メール、最短即日で揃います。
          </p>
        </div>

        {/* メール送信完了 */}
        {sent ? (
          <div style={{
            background: '#fff', borderRadius: 20, padding: '40px 32px',
            border: '1px solid #e5e7eb', textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <p style={{ fontSize: 40, marginBottom: 16 }}>📬</p>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
              メールをご確認ください
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>
              {email} にログインリンクを送りました。<br />
              リンクの有効期限は15分です。
            </p>
          </div>
        ) : (
          /* メール入力フォーム */
          <div style={{
            background: '#fff', borderRadius: 20, padding: '32px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            {error && (
              <p style={{
                fontSize: 13, color: '#dc2626', background: '#fef2f2',
                padding: '10px 14px', borderRadius: 8, marginBottom: 16,
              }}>
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="メールアドレス"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 12,
                  border: '1px solid #d1d5db', fontSize: 15,
                  outline: 'none', boxSizing: 'border-box', marginBottom: 12,
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: loading ? '#9ca3af' : '#6366f1', color: '#fff',
                  fontSize: 15, fontWeight: 700, border: 'none',
                  cursor: loading ? 'default' : 'pointer',
                }}
              >
                {loading ? '送信中...' : '無料で始める'}
              </button>
            </form>

            <a
              href="/onboard/existing"
              style={{
                display: 'block', textAlign: 'center', marginTop: 20,
                fontSize: 13, color: '#9ca3af', textDecoration: 'none',
              }}
            >
              既存サイトをAIが無料で自動診断
            </a>
          </div>
        )}

      </div>
    </div>
  )
}
