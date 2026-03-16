import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createSessionToken, sessionCookieOptions } from '@/lib/session'

export async function GET(req: NextRequest) {
  const nextAuthSession = await auth()

  if (!nextAuthSession?.user?.email) {
    const url = new URL('/onboard/auth', req.url)
    return NextResponse.redirect(url)
  }

  // Google認証済み → カスタムセッションCookieを発行してquestions へ
  const token = await createSessionToken(nextAuthSession.user.email, 'user')
  const { name, value, options } = sessionCookieOptions(token)

  const url = new URL('/onboard/questions', req.url)
  const res = NextResponse.redirect(url)
  res.cookies.set(name, value, options)
  return res
}
