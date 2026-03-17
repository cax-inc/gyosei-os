import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

interface Params { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  const site = await prisma.aiSite.findUnique({ where: { slug } })
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(site)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { slug } = await params

  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const site = await prisma.aiSite.findUnique({ where: { slug } })
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (site.ownerEmail !== session.email) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  const body = await req.json()
  const { siteContent, editorOverlay, templateId } = body

  const updated = await prisma.aiSite.update({
    where: { slug },
    data: {
      ...(siteContent !== undefined && { siteContent }),
      ...(editorOverlay !== undefined && { editorOverlay }),
      ...(templateId !== undefined && { templateId }),
    },
  })
  return NextResponse.json(updated)
}
