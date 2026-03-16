'use client'

import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardAuthPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // すでにセッションがある場合はquestions へ
  useEffect(() => {
    fetch('/api/auth/session-check').then(r => r.json()).then((d: { authenticated: boolean }) => {
      if (d.authenticated) router.replace('/onboard/questions')
    }).catch(() => {})
  }, [router])

  const handleGoogle = async () => {
    setLoading(true)
    await signIn('google', { callbackUrl: '/api/onboard/google-complete' })
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f9fafb', padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: '48px 40px',
        maxWidth: 440, width: '100%', textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🌐</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 8, letterSpacing: '-0.5px' }}>
          サイト作成をはじめる
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 36, lineHeight: 1.7 }}>
          Googleアカウントでログインして、<br />
          行政書士事務所のサイトを作りましょう。
        </p>

        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            padding: '14px 20px', borderRadius: 12,
            border: '1.5px solid #e5e7eb', background: '#fff',
            fontSize: 15, fontWeight: 600, color: '#111827',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            transition: 'box-shadow 0.15s',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'ログイン中…' : 'Googleでログイン'}
        </button>

        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 24, lineHeight: 1.6 }}>
          ログインすることで、
          <a href="#" style={{ color: '#6b7280', textDecoration: 'underline' }}>利用規約</a>と
          <a href="#" style={{ color: '#6b7280', textDecoration: 'underline' }}>プライバシーポリシー</a>
          に同意したものとみなします。
        </p>
      </div>
    </div>
  )
}
