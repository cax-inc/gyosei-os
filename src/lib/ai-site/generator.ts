import Anthropic from '@anthropic-ai/sdk'
import { PREF_TO_SLUG } from './types'
import { derivePrefecture, buildPrefectureLabel, buildAreaDisplayList } from './areas'
import type { GenerateInput, SiteContent } from './types'

const SYSTEM_PROMPT = `あなたは行政書士事務所専門のプロコピーライターです。
提供された情報をもとに、集客力の高いWebサイトコンテンツをJSON形式で生成してください。
出力はJSONのみ。マークダウンのコードブロック（\`\`\`json など）は絶対に使わないでください。
純粋なJSONオブジェクトだけを返してください。

【日本語の品質基準】
以下は士業・法律系Webサイトとして不自然な表現です。絶対に使用しないでください。

❌ 禁止表現 → ✅ 正しい代替
・「話しかけてください」「お声がけください」→「お問い合わせください」
・「気軽に話しかけ」→「気軽にご相談」「気軽にお問い合わせ」
・「チャット」「DM」「メッセージ」→「お問い合わせ」「ご連絡」
・「サービス」（単独使用）→「業務」「申請手続き」「サポート」
・「プロフィール」→「代表者紹介」「事務所紹介」
・「シェア」「いいね」→ 使用禁止
・「ぜひ」の多用（1文書に2回以上）→ 1回まで
・「〜となっております」→「〜です」「〜となっています」
・「〜させていただきます」の多用→「〜いたします」「〜します」に置き換え
・「リーズナブル」「コスパ」→「適正な費用」「明確な料金体系」
・「アフターフォロー」→「手続き完了後のサポート」「継続サポート」
・語尾「〜ませ」の連続使用（例：「くださいませ」）→ 避ける

【CTAテキストの例（参考）】
・「無料相談はこちら」「まずはご相談を」「お問い合わせはこちら」
・「今すぐ相談する」「無料でご相談」「相談予約をする」

【基本トーン】
丁寧・誠実・専門的。読者は法的手続きに不安を抱えた一般の方。
過度にカジュアルな表現・SNS的な言い回しは避け、信頼感を重視すること。`

/** サイトコンテンツをAI生成する */
export async function generateSiteContent(input: GenerateInput): Promise<SiteContent> {
  const anthropic = new Anthropic()
  const servicesText = input.services.join('、')
  const stylesText = input.styles.length > 0 ? input.styles.join('、') : '信頼感重視'

  const prefShort = derivePrefecture(input.serviceAreas).replace(/[都道府県]$/, '')
  const areaText = input.serviceAreas.includes('全国') ? '全国' : input.serviceAreas.slice(0, 5).join('・')

  const prompt = `
行政書士事務所の集客Webサイトコンテンツを生成してください。

【事務所情報】
事務所名: ${input.firmName}
代表者名: ${input.ownerName}
${input.ownerBio ? `代表者経歴: ${input.ownerBio}` : ''}
主な対応エリア: ${areaText}
対応業務: ${servicesText}
事務所の強み: ${input.strengths}
文章スタイル: ${stylesText}

以下のJSON形式で出力してください:

{
  "hero": {
    "headline": "メインキャッチコピー（25字以内・インパクト重視）",
    "subheadline": "詳細説明（50字以内・サービスと場所を含める）",
    "ctaText": "CTAボタンテキスト（12字以内）",
    "ctaNote": "補足テキスト（例：相談料0円・全国対応）"
  },
  "services": [
    {
      "name": "サービス名（${servicesText}から選択）",
      "description": "サービス説明（60字以内・メリット訴求）",
      "icon": "関連する絵文字1文字",
      "price": "料金目安（例：¥55,000〜）"
    }
  ],
  "profile": {
    "title": "事務所紹介",
    "body": "代表者名・経歴（あれば）・強みを自然に織り交ぜた事務所説明文（150字以内）",
    "strengths": ["強み1（20字以内）", "強み2（20字以内）", "強み3（20字以内）"]
  },
  "pricing": [
    {
      "name": "サービス名",
      "price": "¥55,000〜",
      "features": ["含まれる内容1", "含まれる内容2", "含まれる内容3"]
    }
  ],
  "testimonials": [
    {
      "name": "A様（匿名）",
      "role": "相談内容（例：建設業許可）",
      "content": "お客様の感想（80字以内・具体的な体験談）"
    }
  ],
  "faq": [
    { "question": "質問（20字以内）", "answer": "回答（60字以内・安心感を与える）" }
  ],
  "cta": {
    "headline": "行動喚起の見出し（20字以内）",
    "subheadline": "補足テキスト（35字以内）",
    "ctaText": "ボタンテキスト（12字以内）"
  }
}

注意:
- servicesは選択された業務を全て含める（最大8つ）
- pricingは代表的なサービス3つ（servicesから選ぶ）
- testimonialsは3件生成（匿名）
- faqは5〜6件生成
- 全て自然な日本語で書く
- 強みのテキストをそのまま使わず、セールスコピーとして昇華させる`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = message.content[0].type === 'text' ? message.content[0].text.trim() : ''

  const content = sanitizeSiteContent(parseJsonSafely(rawText)) as SiteContent

  // 対応エリアはユーザー入力から構築
  const areaList = buildAreaDisplayList(input.serviceAreas)
  if (areaList.length > 0) {
    content.area = {
      description: input.serviceAreas.includes('全国')
        ? '全国からのご相談に対応しています。オンライン対応も承っています。'
        : `${prefShort}を中心に周辺エリアのご相談に対応しています。`,
      areas: areaList,
    }
  } else {
    content.area = undefined
  }

  content.prefectureLabel = buildPrefectureLabel(input.serviceAreas)

  return content
}

/** SEOキーワード候補を生成する（サイト生成と同時に呼ぶ） */
export async function generateSeoKeywords(input: GenerateInput): Promise<string[]> {
  const anthropic = new Anthropic()
  const derivedPref = derivePrefecture(input.serviceAreas)
  const prefecture = derivedPref.replace(/[都道府県]$/, '')

  const prompt = `
行政書士事務所（${derivedPref}）のSEOページ用キーワードを10個生成してください。
対応業務: ${input.services.join('、')}

形式:「業務名 ${prefecture}」「業務名 地域名」のように「サービス × 地域」の組み合わせにしてください。
JSON配列で出力してください。例: ["建設業許可 東京", "飲食店営業許可 新宿", ...]
マークダウン不要。配列だけ返してください。`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  })

  const rawText = message.content[0].type === 'text' ? message.content[0].text.trim() : '[]'

  try {
    const match = rawText.match(/\[[\s\S]*\]/)
    return match ? (JSON.parse(match[0]) as string[]) : []
  } catch {
    return []
  }
}

/** 一意スラッグを生成する */
export function buildSlug(prefecture: string): string {
  const prefSlug = PREF_TO_SLUG[prefecture] ?? 'japan'
  const suffix = Math.random().toString(36).substring(2, 8)
  return `${prefSlug}-${suffix}`
}

// ---- 日本語サニタイザー ----

/** 生成後にHP用として不自然な表現を機械的に置換する */
function sanitizeJapanese(text: string): string {
  const replacements: [RegExp, string][] = [
    [/話しかけてください/g,       'お問い合わせください'],
    [/お声がけください/g,         'お問い合わせください'],
    [/気軽に話しかけ/g,           '気軽にお問い合わせ'],
    [/お気軽にどうぞ/g,           'お気軽にお問い合わせください'],
    [/チャットで相談/g,           'お問い合わせフォームよりご相談'],
    [/アフターフォロー/g,         '手続き完了後のサポート'],
    [/リーズナブル/g,             '適正な費用'],
    [/コスパ/g,                   '費用対効果'],
    [/〜させていただきます。/g,   '〜いたします。'],
    [/くださいませ/g,             'ください'],
    [/となっております。/g,       'となっています。'],
  ]
  return replacements.reduce((s, [pattern, replacement]) => s.replace(pattern, replacement), text)
}

/** SiteContentの文字列フィールドを再帰的にサニタイズする */
function sanitizeSiteContent(obj: unknown): unknown {
  if (typeof obj === 'string') return sanitizeJapanese(obj)
  if (Array.isArray(obj)) return obj.map(sanitizeSiteContent)
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [k, sanitizeSiteContent(v)])
    )
  }
  return obj
}

// ---- 内部ユーティリティ ----

function parseJsonSafely(text: string): SiteContent {
  // コードブロックを除去
  const clean = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  try {
    return JSON.parse(clean) as SiteContent
  } catch {
    // JSONを文字列中から抽出
    const match = clean.match(/\{[\s\S]*\}/)
    if (match) {
      return JSON.parse(match[0]) as SiteContent
    }
    throw new Error('AIの生成結果をJSONとして解析できませんでした')
  }
}
