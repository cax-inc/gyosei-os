export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'

export default async function AdminPage() {
  const now = new Date()
  const ago7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [totalSites, publishedSites, totalLeads, newLeads7d, newSites7d] = await Promise.all([
    prisma.aiSite.count(),
    prisma.aiSite.count({ where: { status: 'published' } }),
    prisma.aiSiteLead.count(),
    prisma.aiSiteLead.count({ where: { createdAt: { gte: ago7 } } }),
    prisma.aiSite.count({ where: { createdAt: { gte: ago7 } } }),
  ])

  const recentLeads = await prisma.aiSiteLead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      site: { select: { firmName: true, slug: true } },
    },
  })

  return (
    <div className="space-y-8">

      {/* KPIカード */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p className="text-xs text-gray-500 mb-1">総ユーザー数</p>
          <p className="text-2xl font-bold text-gray-900">{totalSites}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p className="text-xs text-gray-500 mb-1">公開中サイト</p>
          <p className="text-2xl font-bold text-green-600">{publishedSites}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p className="text-xs text-gray-500 mb-1">累計問い合わせ</p>
          <p className="text-2xl font-bold text-blue-600">{totalLeads}</p>
          <p className="text-xs text-gray-400 mt-1">直近7日: {newLeads7d}件</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
          <p className="text-xs text-gray-500 mb-1">新規登録（7日）</p>
          <p className="text-2xl font-bold text-violet-600">{newSites7d}</p>
        </div>
      </div>

      {/* 最近の問い合わせ */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">最近の問い合わせ</h2>
        </div>
        {recentLeads.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-400 text-center">まだ問い合わせがありません</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">氏名</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">メール</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">サイト</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">日時</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead, i) => (
                <tr key={lead.id} className={i !== recentLeads.length - 1 ? 'border-b border-gray-100' : ''}>
                  <td className="px-6 py-3 font-medium text-gray-900">{lead.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{lead.email ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.site.firmName}</td>
                  <td className="px-6 py-3 text-right text-gray-400 text-xs">
                    {lead.createdAt.toLocaleDateString('ja-JP')}
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
