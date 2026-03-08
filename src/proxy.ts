import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/session'

export default async function proxy(req: NextRequest) {
  const token = req.cookies.get('session')?.value
  const session = token ? await verifySessionToken(token) : null

  if (!session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
