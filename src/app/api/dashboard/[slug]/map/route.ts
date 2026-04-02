import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import type { SiteContent, MapLocation } from '@/lib/ai-site/types'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const session = await getSession()

    const site = await prisma.aiSite.findUnique({ where: { slug } })
    if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!session || session.email !== site.ownerEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { address } = await req.json() as { address?: string }

    const current = site.siteContent as unknown as SiteContent
    const map: MapLocation | undefined = address ? { address } : undefined
    const updated: SiteContent = { ...current, map }

    await prisma.aiSite.update({
      where: { slug },
      data: { siteContent: updated as object },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[map] error:', err)
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 })
  }
}
