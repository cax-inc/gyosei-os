import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROOT_DOMAIN = 'coreai-x.com'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // ローカル開発環境ではサブドメインルーティングをスキップ
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return NextResponse.next()
  }

  // サブドメインを取得（例: "tokyo-law" or "app" or "admin" or ""）
  const subdomain = hostname.endsWith(`.${ROOT_DOMAIN}`)
    ? hostname.slice(0, -(ROOT_DOMAIN.length + 1))
    : null

  // admin.coreai-x.com → /admin/* へのアクセスを保護
  // （ルートにアクセスした場合は /admin にリダイレクト）
  if (subdomain === 'admin') {
    // /admin/* 以外のパスは /admin/* に書き換え（/ も含む）
    if (!pathname.startsWith('/admin')) {
      url.pathname = '/admin' + (pathname === '/' ? '' : pathname)
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

  // app.coreai-x.com → ユーザー管理画面（既存パスをそのまま使用）
  if (subdomain === 'app') {
    if (pathname === '/') {
      url.pathname = '/sites'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // {slug}.coreai-x.com → /{slug} の公開サイトに書き換え
  if (subdomain && subdomain !== 'www') {
    // ルートへのアクセスをスラグのページに書き換え
    if (pathname === '/') {
      url.pathname = `/${subdomain}`
      return NextResponse.rewrite(url)
    }
    // その他のパスは /slug/path に書き換え（必要に応じて拡張）
    url.pathname = `/${subdomain}${pathname}`
    return NextResponse.rewrite(url)
  }

  // coreai-x.com → LP（そのまま）
  return NextResponse.next()
}

export const config = {
  matcher: [
    // API・静的ファイルを除く全パス
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
