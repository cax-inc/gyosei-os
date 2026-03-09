export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { siteUrl } from '@/lib/urls'

export default async function AdminUsersPage() {
  const sites = await prisma.aiSite.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      slug: true,
      firmName: true,
      prefecture: true,
      ownerEmail: true,
      status: true,
      createdAt: true,
      _count: { select: { leads: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">ユーザー管理</h1>
        <p className="text-sm text-gray-400 mt-0.5">登録済みユーザー一覧</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {sites.length === 0 ? (
          <p className="px-6 py-12 text-sm text-gray-400 text-center">登録ユーザーがいません</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">事務所名</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">都道府県</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">メール</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">ステータス</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">問い合わせ</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">登録日</th>
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
                  <td className="px-4 py-4 text-gray-500">{site.ownerEmail ?? '—'}</td>
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
                  <td className="px-4 py-4 text-right text-gray-400 text-xs">
                    {site.createdAt.toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {site.status === 'published' && (
                        <Link
                          href={siteUrl(site.slug)}
                          target="_blank"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          サイト
                        </Link>
                      )}
                      <Link
                        href={`/dashboard/${site.slug}`}
                        className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors"
                      >
                        詳細
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
