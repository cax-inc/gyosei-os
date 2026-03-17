import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

interface Params { params: Promise<{ slug: string }> }

// クレジット残数を取得
export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params

  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const site = await prisma.aiSite.findUnique({ where: { slug }, select: { ownerEmail: true, chatCredits: true, plan: true } })
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (site.ownerEmail !== session.email) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  return NextResponse.json({ chatCredits: site.chatCredits, plan: site.plan })
}

// クレジットを1消費
export async function POST(_req: NextRequest, { params }: Params) {
  const { slug } = await params

  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const site = await prisma.aiSite.findUnique({ where: { slug }, select: { ownerEmail: true, chatCredits: true, plan: true } })
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (site.ownerEmail !== session.email) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  // 有料プランは消費しない
  if (site.plan) {
    return NextResponse.json({ chatCredits: site.chatCredits, plan: site.plan })
  }

  if (site.chatCredits <= 0) {
    return NextResponse.json({ error: 'クレジットが不足しています' }, { status: 402 })
  }

  const updated = await prisma.aiSite.update({
    where: { slug },
    data: { chatCredits: { decrement: 1 } },
    select: { chatCredits: true, plan: true },
  })

  return NextResponse.json({ chatCredits: updated.chatCredits, plan: updated.plan })
}
