export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { SiteTemplate } from '@/components/editor/SiteTemplate'
import { GYOSEI_TEMPLATES } from '@/lib/templates'
import type { SiteContent } from '@/lib/ai-site/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const site = await prisma.aiSite.findUnique({
    where: { slug, status: 'published' },
    select: { firmName: true, prefecture: true, services: true },
  })
  if (!site) return {}

  return {
    title: `${site.firmName} | ${site.prefecture}の行政書士`,
    description: `${site.prefecture}の行政書士 ${site.firmName}。${site.services.slice(0, 3).join('・')}など各種許認可申請をサポートします。`,
  }
}

export default async function PublicSitePage({ params }: Props) {
  const { slug } = await params

  const site = await prisma.aiSite.findUnique({ where: { slug } })
  if (!site) notFound()

  // 未公開サイトの場合は案内ページを表示
  if (site.status !== 'published') {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 480, width: '100%', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
            このサイトは現在公開されていません
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 32 }}>
            サイトオーナーが公開設定をオフにしています。
          </p>

          <div style={{ background: '#f3f4f6', borderRadius: 12, padding: '24px 20px', textAlign: 'left', marginBottom: 32 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>
              サイトオーナーの方へ
            </p>
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8, marginBottom: 16 }}>
              サイトを公開するには、管理画面から公開設定を変更してください。
            </p>
            <ol style={{ fontSize: 13, color: '#374151', lineHeight: 2, paddingLeft: 20, margin: 0 }}>
              <li>管理画面にログイン</li>
              <li>ダッシュボード右上の「公開する」ボタンをクリック</li>
              <li>公開を確認して完了</li>
            </ol>
          </div>

          <a
            href="/login"
            style={{ display: 'inline-block', background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 600, padding: '12px 28px', borderRadius: 8, textDecoration: 'none' }}
          >
            管理画面にログイン
          </a>
        </div>
      </div>
    )
  }

  const content = site.siteContent as unknown as SiteContent
  const theme = site.templateId ? GYOSEI_TEMPLATES.find(t => t.id === site.templateId) : undefined

  return (
    <SiteTemplate
      firmName={site.firmName}
      prefecture={site.prefecture}
      content={content}
      siteSlug={slug}
      editable={false}
      theme={theme}
    />
  )
}
