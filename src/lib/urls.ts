const ROOT_DOMAIN = 'coreai-x.com'
const IS_PROD = process.env.NODE_ENV === 'production'

/**
 * 公開サイトのURL
 * 本番: https://{slug}.coreai-x.com
 * 開発: http://localhost:3000/{slug}
 */
export function siteUrl(slug: string): string {
  if (IS_PROD) return `https://${slug}.${ROOT_DOMAIN}`
  return `/${slug}`
}

/**
 * ユーザー管理画面のURL（app.coreai-x.com）
 * 本番: https://app.coreai-x.com{path}
 * 開発: http://localhost:3000{path}
 */
export function appUrl(path: string = ''): string {
  if (IS_PROD) return `https://app.${ROOT_DOMAIN}${path}`
  return path || '/'
}

/**
 * 管理者画面のURL（admin.coreai-x.com）
 * 本番: https://admin.coreai-x.com{path}
 * 開発: http://localhost:3000{path}
 */
export function adminUrl(path: string = ''): string {
  if (IS_PROD) return `https://admin.${ROOT_DOMAIN}${path}`
  return path || '/admin'
}
