import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { slug } = await req.json() as { slug: string }
    if (!slug) {
      return NextResponse.json({ error: 'パラメータが不正です' }, { status: 400 })
    }

    const site = await prisma.aiSite.findUnique({ where: { slug } })
    if (!site) {
      return NextResponse.json({ error: 'サイトが見つかりません' }, { status: 404 })
    }
    if (site.ownerEmail !== session.email) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 })
    }

    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://app.webseisei.com'
      : 'http://localhost:3000'

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_PRICE_COINS!,
        quantity: 1,
      }],
      customer: site.stripeCustomerId ?? undefined,
      customer_email: !site.stripeCustomerId ? (session.email ?? undefined) : undefined,
      success_url: `${baseUrl}/dashboard/${slug}?coins=purchased`,
      cancel_url: `${baseUrl}/dashboard/${slug}`,
      metadata: { slug, type: 'coins' },
      locale: 'ja',
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error('[stripe/coins/checkout] error:', err)
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 })
  }
}
