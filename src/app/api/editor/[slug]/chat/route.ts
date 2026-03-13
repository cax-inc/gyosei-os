import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'

export const maxDuration = 30

interface Params {
  params: Promise<{ slug: string }>
}

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const { message } = await req.json() as { message: string }

  const site = await prisma.aiSite.findUnique({
    where: { slug },
    select: { firmName: true, services: true, siteContent: true },
  })
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const anthropic = new Anthropic()

  const reply = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    system: `あなたは「せいせい君」という行政書士事務所のサイト編集アシスタントです。
明るく親しみやすい口調で、サイトの文章改善や内容の提案をします。
事務所名: ${site.firmName}
対応業務: ${site.services.join('、')}
回答は200字以内で簡潔に。具体的な文章案がある場合はそのまま使えるものを提案してください。`,
    messages: [{ role: 'user', content: message }],
  })

  const text = reply.content[0].type === 'text' ? reply.content[0].text : ''
  return NextResponse.json({ reply: text })
}
