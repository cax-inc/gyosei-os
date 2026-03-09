import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, sessionCookieOptions } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json() as { email: string; password: string }

    const adminEmail = process.env.ADMIN_EMAIL ?? ''
    const adminPassword = process.env.ADMIN_PASSWORD ?? ''
    const authSecret = process.env.AUTH_SECRET ?? ''

    if (!adminEmail) {
      console.error('[login] ADMIN_EMAIL is not set')
      return NextResponse.json({ error: 'ADMIN_EMAIL not configured' }, { status: 500 })
    }
    if (!adminPassword) {
      console.error('[login] ADMIN_PASSWORD is not set')
      return NextResponse.json({ error: 'ADMIN_PASSWORD not configured' }, { status: 500 })
    }
    if (!authSecret) {
      console.error('[login] AUTH_SECRET is not set')
      return NextResponse.json({ error: 'AUTH_SECRET not configured' }, { status: 500 })
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: 'メールアドレスまたはパスワードが正しくありません' }, { status: 401 })
    }

    const token = await createSessionToken(email, 'admin')
    const { name, value, options } = sessionCookieOptions(token)

    const res = NextResponse.json({ success: true })
    res.cookies.set(name, value, options)
    console.log('[login] Login successful for:', email)
    return res
  } catch (err) {
    console.error('[login] Unexpected error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
