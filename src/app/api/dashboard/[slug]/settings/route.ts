import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

interface Params {
  params: Promise<{ slug: string }>
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { slug } = await params

  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const site = await prisma.aiSite.findUnique({
    where: { slug },
    select: { id: true, ownerEmail: true },
  })
  if (!site) {
    return NextResponse.json({ error: 'サイトが見つかりません' }, { status: 404 })
  }
  if (session.email !== site.ownerEmail) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'リクエストの形式が不正です' }, { status: 400 })
  }

  const { firmName, ownerName, autoReply } = body as {
    firmName?: string
    ownerName?: string
    autoReply?: boolean
  }

  await prisma.aiSite.update({
    where: { id: site.id },
    data: {
      ...(firmName !== undefined ? { firmName: firmName.trim() } : {}),
      ...(ownerName !== undefined ? { ownerName: ownerName.trim() } : {}),
      ...(autoReply !== undefined ? { autoReply } : {}),
    },
  })

  return NextResponse.json({ success: true })
}
