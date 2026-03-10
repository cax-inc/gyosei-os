'use client'

import { useRouter } from 'next/navigation'

const FEATURES = [
  {
    icon: '⚡',
    reason: 'NetflixやAmazonと同じ技術で構築',
    result: '一般的なサイトより3〜5倍高速表示',
  },
  {
    icon: '🔒',
    reason: 'データベースを外部に公開しない構造',
    result: 'ハッキングリスクが一般的なサイトより大幅に低い',
  },
  {
    icon: '📱',
    reason: '最初からスマホ前提で設計',
    result: 'スマホ対応が標準装備',
  },
  {
    icon: '🤖',
    reason: 'AIが自動でコピーライティングまで対応',
    result: '最短5分でプロ品質のサイトが完成',
  },
]

export default function OnboardLandingPage() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(150deg, #eef2ff 0%, #f0fdf4 50%, #fdf4ff 100%)',
      fontFamily: "'Inter','Helvetica Neue',Arial,'Hiragino Sans',sans-serif",
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '72px 24px 80px' }}>

        {/* バッジ */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
            padding: '6px 16px', borderRadius: 100,
            fontSize: 12, fontWeight: 700, color: '#6366f1', letterSpacing: '0.5px',
          }}>
            AI集客OS for 士業
          </span>
        </div>

        {/* ヘッドライン */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 800,
            color: '#1e1b4b', letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20,
          }}>
            行政書士事務所のサイトを<br />AIが5分で自動生成
          </h1>
          <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.8, marginBottom: 0 }}>
            一般的なサイトより高速・安全な最新技術で、<br />
            プロ品質の集客サイトを無料で作れます。
          </p>
        </div>

        {/* 特徴リスト */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 64 }}>
          {FEATURES.map((f) => (
            <div key={f.reason} style={{
              background: '#fff',
              borderRadius: 16,
              padding: '24px 28px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'flex-start', gap: 20,
            }}>
              <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{f.icon}</span>
              <div>
                <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4, lineHeight: 1.5 }}>
                  {f.reason}
                </p>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', letterSpacing: '-0.3px' }}>
                  → {f.result}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 注意書き */}
        <div style={{
          background: 'rgba(99,102,241,0.04)',
          border: '1px solid rgba(99,102,241,0.12)',
          borderRadius: 12, padding: '16px 20px', marginBottom: 48,
        }}>
          <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.8, margin: 0 }}>
            ※ 本サービスはAIと最新技術（Next.js）による効率化により、従来の制作会社と比較して大幅なコスト削減を実現しています。浮いたコストをそのままお客様への低価格でご提供しています。
          </p>
        </div>

        {/* CTAボタン */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => router.push('/onboard/questions')}
            style={{
              background: '#6366f1', color: '#fff', fontWeight: 700,
              fontSize: 17, padding: '18px 48px', borderRadius: 100,
              border: 'none', cursor: 'pointer', letterSpacing: '-0.3px',
              boxShadow: '0 4px 28px rgba(99,102,241,0.35)',
              display: 'inline-block',
            }}
          >
            無料でサイトを作る →
          </button>
          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 16 }}>
            登録不要・クレジットカード不要・約5分で完成
          </p>
        </div>

      </div>
    </div>
  )
}
