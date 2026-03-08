export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function SitesPage() {
  const sites = await prisma.aiSite.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      slug: true,
      firmName: true,
      prefecture: true,
      status: true,
      createdAt: true,
      _count: { select: { leads: true } },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">サイト管理</h1>
            <p className="text-sm text-gray-500 mt-1">作成済みの集客サイト一覧</p>
          </div>
          <Link
            href="/onboard"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + 新規サイト作成
          </Link>
        </div>

        {sites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-4xl mb-4">🌐</p>
            <p className="text-gray-500 font-medium mb-2">サイトがまだありません</p>
            <p className="text-sm text-gray-400 mb-6">オンボーディングからAIサイトを生成してください</p>
            <Link
              href="/onboard"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              サイトを作成する
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sites.map((site) => (
              <div
                key={site.slug}
                className="bg-white rounded-xl border border-gray-200 px-6 py-5 flex items-center gap-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-gray-900 truncate">{site.firmName}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      site.status === 'published'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {site.status === 'published' ? '公開中' : '下書き'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {site.prefecture} ・ /{site.slug} ・ 問い合わせ {site._count.leads}件
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/${site.slug}`}
                    target="_blank"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    公開サイト
                  </Link>
                  <Link
                    href={`/dashboard/${site.slug}`}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    管理する
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
