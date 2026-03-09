export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { siteUrl } from '@/lib/urls'
import { getSession } from '@/lib/session'

export default async function SitesPage() {
  const session = await getSession()
  const userEmail = session?.email

  const sites = await prisma.aiSite.findMany({
    where: userEmail ? { ownerEmail: userEmail } : undefined,
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

  const published = sites.filter((s) => s.status === 'published').length
  const totalLeads = sites.reduce((sum, s) => sum + s._count.leads, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">サイト管理</h1>
            <p className="text-sm text-gray-400 mt-0.5">作成済みの集客サイト一覧</p>
          </div>
          <Link
            href="/onboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + 新規サイト作成
          </Link>
        </div>

        {/* サマリーカード */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <p className="text-xs text-gray-500 mb-1">サイト数</p>
            <p className="text-2xl font-bold text-gray-900">{sites.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <p className="text-xs text-gray-500 mb-1">公開中</p>
            <p className="text-2xl font-bold text-green-600">{published}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            <p className="text-xs text-gray-500 mb-1">累計問い合わせ</p>
            <p className="text-2xl font-bold text-blue-600">{totalLeads}</p>
          </div>
        </div>

        {/* サイト一覧 */}
        {sites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-4xl mb-4">🌐</p>
            <p className="text-gray-600 font-medium mb-1">サイトがまだありません</p>
            <p className="text-sm text-gray-400 mb-6">オンボーディングからAIサイトを生成してください</p>
            <Link
              href="/onboard"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              サイトを作成する
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">事務所名</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">都道府県</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">ステータス</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">問い合わせ</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site, i) => (
                  <tr
                    key={site.slug}
                    className={`${i !== sites.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{site.firmName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{site.slug}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{site.prefecture}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${
                        site.status === 'published'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {site.status === 'published' ? '公開中' : '下書き'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-gray-900">
                      {site._count.leads}件
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        {site.status === 'published' && (
                          <Link
                            href={siteUrl(site.slug)}
                            target="_blank"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            公開サイト
                          </Link>
                        )}
                        <Link
                          href={`/dashboard/${site.slug}`}
                          className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors"
                        >
                          管理する
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
