import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

interface Params {
  params: Promise<{ pageId: string }>
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { pageId } = await params

  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const page = await prisma.aiSeoPage.findUnique({
    where: { id: pageId },
    include: { site: { select: { ownerEmail: true } } },
  })
  if (!page) {
    return NextResponse.json({ error: 'ページが見つかりません' }, { status: 404 })
  }
  if (session.email !== page.site.ownerEmail) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  await prisma.aiSeoPage.delete({ where: { id: pageId } })

  return NextResponse.json({ success: true })
}
