import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

interface Params {
  params: Promise<{ slug: string }>
}

export async function POST(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  const session = await getSession()

  const site = await prisma.aiSite.findUnique({ where: { slug } })
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!session || session.email !== site.ownerEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.aiSite.update({
    where: { slug },
    data: { status: 'draft' },
  })

  return NextResponse.json({ success: true })
}
