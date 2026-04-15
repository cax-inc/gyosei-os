export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SettingsForm } from '@/components/dashboard/SettingsForm'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function SettingsPage({ params }: Props) {
  const { slug } = await params

  const site = await prisma.aiSite.findUnique({
    where: { slug },
    select: {
      firmName: true,
      ownerName: true,
      ownerEmail: true,
      autoReply: true,
      plan: true,
      stripeCustomerId: true,
    },
  })
  if (!site) notFound()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="text-sm text-gray-500 mt-1">アカウント情報や通知設定を管理します</p>
      </div>

      <SettingsForm
        slug={slug}
        firmName={site.firmName}
        ownerName={site.ownerName ?? ''}
        ownerEmail={site.ownerEmail ?? ''}
        autoReply={site.autoReply}
        plan={site.plan}
        hasStripe={!!site.stripeCustomerId}
      />
    </div>
  )
}
