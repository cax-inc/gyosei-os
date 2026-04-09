import { NextResponse } from 'next/server'

export const maxDuration = 30

type CheckItem = {
  key: string
  label: string
  score: number
  max: number
  message: string
}

function normalizeUrl(input: string): string | null {
  try {
    const trimmed = input.trim()
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const u = new URL(withProto)
    if (!/^https?:$/.test(u.protocol)) return null
    return u.toString()
  } catch {
    return null
  }
}

function pick(html: string, re: RegExp): string | null {
  const m = html.match(re)
  return m ? (m[1] ?? m[0]) : null
}

function countMatches(html: string, re: RegExp): number {
  return (html.match(re) || []).length
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (typeof url !== 'string' || !url) {
      return NextResponse.json({ error: 'URLを入力してください' }, { status: 400 })
    }
    const normalized = normalizeUrl(url)
    if (!normalized) {
      return NextResponse.json({ error: 'URLの形式が正しくありません' }, { status: 400 })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    let res: Response
    try {
      res = await fetch(normalized, {
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; webseiseiBot/1.0; +https://webseisei.com)',
          'Accept': 'text/html,application/xhtml+xml',
        },
      })
    } catch {
      clearTimeout(timeout)
      return NextResponse.json({ error: 'サイトに接続できませんでした。URLをご確認ください。' }, { status: 400 })
    }
    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json({ error: `サイトの取得に失敗しました（HTTP ${res.status}）` }, { status: 400 })
    }

    const html = (await res.text()).slice(0, 500_000)
    const finalUrl = res.url || normalized
    const isHttps = finalUrl.startsWith('https://')

    const title = pick(html, /<title[^>]*>([\s\S]*?)<\/title>/i)?.trim() || ''
    const metaDesc = pick(html, /<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i) || ''
    const viewport = /<meta[^>]+name=["']viewport["']/i.test(html)
    const ogTitle = /<meta[^>]+property=["']og:title["']/i.test(html)
    const ogImage = /<meta[^>]+property=["']og:image["']/i.test(html)
    const h1Count = countMatches(html, /<h1[\s>]/gi)
    const imgCount = countMatches(html, /<img\b/gi)
    const imgAltCount = countMatches(html, /<img\b[^>]*\salt=["'][^"']*["']/gi)
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    const textLength = text.length
    const hasTel = /(?:tel:|0\d{1,4}-\d{1,4}-\d{3,4})/.test(html)
    const hasMail = /mailto:|お問い合わせ|問い合わせ|contact/i.test(html)
    const hasForm = /<form\b/i.test(html)
    const htmlSizeKb = Math.round(html.length / 1024)

    const items: CheckItem[] = []

    items.push({
      key: 'https',
      label: 'HTTPS（常時SSL化）',
      max: 10,
      score: isHttps ? 10 : 0,
      message: isHttps ? '常時SSL化されています' : 'HTTPS化されていません。信頼性・SEOに悪影響です',
    })

    items.push({
      key: 'title',
      label: 'タイトルタグ',
      max: 15,
      score: title.length === 0 ? 0 : title.length < 10 ? 6 : title.length > 60 ? 10 : 15,
      message: title.length === 0
        ? 'タイトルタグがありません'
        : title.length < 10
          ? `タイトルが短すぎます（${title.length}文字）`
          : title.length > 60
            ? `タイトルが長すぎます（${title.length}文字）。検索結果で見切れる可能性があります`
            : `適切な長さです（${title.length}文字）`,
    })

    items.push({
      key: 'description',
      label: 'メタディスクリプション',
      max: 10,
      score: metaDesc.length === 0 ? 0 : metaDesc.length < 50 ? 5 : metaDesc.length > 160 ? 7 : 10,
      message: metaDesc.length === 0
        ? '設定されていません。検索結果に表示される説明文がありません'
        : `${metaDesc.length}文字で設定されています`,
    })

    items.push({
      key: 'viewport',
      label: 'スマホ対応（viewport）',
      max: 15,
      score: viewport ? 15 : 0,
      message: viewport ? 'スマートフォン対応の設定があります' : 'viewport設定がなく、スマホで見づらい可能性が高いです',
    })

    items.push({
      key: 'h1',
      label: '見出し（h1）',
      max: 10,
      score: h1Count === 0 ? 0 : h1Count === 1 ? 10 : 6,
      message: h1Count === 0
        ? 'h1見出しがありません'
        : h1Count === 1
          ? 'h1が1つ、適切です'
          : `h1が${h1Count}個あります。1つに絞ることを推奨`,
    })

    const altRatio = imgCount === 0 ? 1 : imgAltCount / imgCount
    items.push({
      key: 'alt',
      label: '画像のalt属性',
      max: 5,
      score: imgCount === 0 ? 5 : Math.round(altRatio * 5),
      message: imgCount === 0
        ? '画像なし'
        : `${imgCount}枚中${imgAltCount}枚にalt設定（${Math.round(altRatio * 100)}%）`,
    })

    items.push({
      key: 'og',
      label: 'OGP（SNSシェア対応）',
      max: 5,
      score: (ogTitle ? 3 : 0) + (ogImage ? 2 : 0),
      message: ogTitle && ogImage
        ? 'OGP設定済み'
        : 'OGPが不足しています。SNSシェア時に見栄えが悪くなります',
    })

    items.push({
      key: 'content',
      label: 'コンテンツ量',
      max: 10,
      score: textLength < 300 ? 2 : textLength < 800 ? 5 : textLength < 2000 ? 8 : 10,
      message: `本文約${textLength}文字${textLength < 800 ? '。情報量が少ない可能性があります' : ''}`,
    })

    items.push({
      key: 'contact',
      label: '問い合わせ導線',
      max: 10,
      score: (hasForm ? 6 : 0) + (hasTel ? 2 : 0) + (hasMail ? 2 : 0),
      message: hasForm
        ? '問い合わせフォームがあります'
        : hasTel || hasMail
          ? '電話/メール導線はありますが、フォームがありません'
          : '問い合わせ導線が見つかりません',
    })

    items.push({
      key: 'size',
      label: 'ページサイズ',
      max: 10,
      score: htmlSizeKb > 500 ? 3 : htmlSizeKb > 200 ? 7 : 10,
      message: `HTML約${htmlSizeKb}KB${htmlSizeKb > 500 ? '。重すぎる可能性があります' : ''}`,
    })

    const totalMax = items.reduce((s, i) => s + i.max, 0)
    const totalScore = items.reduce((s, i) => s + i.score, 0)
    const score = Math.round((totalScore / totalMax) * 100)

    let grade = 'D'
    if (score >= 85) grade = 'S'
    else if (score >= 70) grade = 'A'
    else if (score >= 55) grade = 'B'
    else if (score >= 40) grade = 'C'

    return NextResponse.json({
      url: finalUrl,
      score,
      grade,
      title,
      items,
    })
  } catch (e) {
    console.error('audit error', e)
    return NextResponse.json({ error: '診断に失敗しました' }, { status: 500 })
  }
}
