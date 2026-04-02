import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(150deg, #eef2ff 0%, #f0fdf4 50%, #fdf4ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Inter','Helvetica Neue',Arial,'Hiragino Sans',sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

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
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{
            fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 800,
            color: '#1e1b4b', letterSpacing: '-1.5px', lineHeight: 1.2, marginBottom: 14,
          }}>
            行政書士のWeb、<br />すべておまかせ。
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7 }}>
            開業から廃業まで、Webはnorenにおまかせください。
          </p>
        </div>

        {/* 2択カード */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Link href="/onboard/create" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: 16, padding: '28px 24px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', gap: 20,
              cursor: 'pointer', transition: 'box-shadow 0.2s, border-color 0.2s',
            }}>
              <span style={{ fontSize: 36, flexShrink: 0 }}>🚀</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
                  新規開業の方
                </p>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                  質問に答えるだけで、本格的なWebサイトを最短即日で公開できます。
                </p>
              </div>
              <span style={{ fontSize: 20, color: '#d1d5db', flexShrink: 0 }}>→</span>
            </div>
          </Link>

          <Link href="/onboard/existing" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: 16, padding: '28px 24px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', gap: 20,
              cursor: 'pointer', transition: 'box-shadow 0.2s, border-color 0.2s',
            }}>
              <span style={{ fontSize: 36, flexShrink: 0 }}>🔄</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 6 }}>
                  既にサイトをお持ちの方
                </p>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                  URLを入力するだけ。AIがサイトを無料で自動診断します。
                </p>
              </div>
              <span style={{ fontSize: 20, color: '#d1d5db', flexShrink: 0 }}>→</span>
            </div>
          </Link>
        </div>

      </div>
    </div>
  )
}
