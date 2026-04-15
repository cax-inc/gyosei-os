export interface SiteTemplateTheme {
  id: string
  name: string
  tag: string
  desc: string
  colors: {
    primary: string
    accent: string
    bg: string
    surface: string
    text: string
    sub: string
  }
  style: {
    fontFamily: string
    borderRadius: string
    headerStyle: 'solid' | 'bordered' | 'minimal'
    heroLayout: 'left' | 'center' | 'fullbg' | 'split'
  }
}

export const GYOSEI_TEMPLATES: SiteTemplateTheme[] = [
  // ── グレー・ネイビー・ブルー・ホワイト系 ──
  {
    id: 'trustful-navy',
    name: 'トラストネイビー',
    tag: '信頼・誠実',
    desc: '深いネイビーで知性と安心感。王道の士業スタイル',
    colors: { primary: '#1B3A6B', accent: '#C8A84B', bg: '#F8F9FC', surface: '#FFFFFF', text: '#1A2340', sub: '#6B7A99' },
    style: { fontFamily: '"Noto Serif JP", serif', borderRadius: '4px', headerStyle: 'solid', heroLayout: 'fullbg' },
  },
  {
    id: 'elegant-charcoal',
    name: 'エレガントチャコール',
    tag: '高級感・格式',
    desc: 'チャコール×ゴールドで上質な格式と専門性を表現',
    colors: { primary: '#2C2C2C', accent: '#B8962E', bg: '#F9F9F7', surface: '#FFFFFF', text: '#1A1A1A', sub: '#888888' },
    style: { fontFamily: '"Noto Serif JP", serif', borderRadius: '2px', headerStyle: 'solid', heroLayout: 'fullbg' },
  },
  {
    id: 'sky-reliable',
    name: 'スカイリライアブル',
    tag: '清潔感・誠実',
    desc: '明るいスカイブルーで清潔・誠実・オープンな印象',
    colors: { primary: '#1A6EAB', accent: '#5BB8F5', bg: '#F3F8FD', surface: '#FFFFFF', text: '#0D2A42', sub: '#6B8FAD' },
    style: { fontFamily: '"Noto Sans JP", sans-serif', borderRadius: '8px', headerStyle: 'solid', heroLayout: 'left' },
  },
  {
    id: 'pure-minimal',
    name: 'ピュアミニマル',
    tag: 'シンプル・モダン',
    desc: '余白を活かした現代的なミニマルデザイン',
    colors: { primary: '#111111', accent: '#3B82F6', bg: '#FFFFFF', surface: '#F7F7F7', text: '#111111', sub: '#999999' },
    style: { fontFamily: '"Noto Sans JP", sans-serif', borderRadius: '6px', headerStyle: 'minimal', heroLayout: 'center' },
  },
  {
    id: 'midnight-pro',
    name: 'ミッドナイトプロ',
    tag: '専門性・先進性',
    desc: 'ダークテーマで専門性と先進的なイメージを強調',
    colors: { primary: '#0F172A', accent: '#38BDF8', bg: '#0F172A', surface: '#1E293B', text: '#F1F5F9', sub: '#64748B' },
    style: { fontFamily: '"Noto Sans JP", sans-serif', borderRadius: '8px', headerStyle: 'solid', heroLayout: 'fullbg' },
  },
  {
    id: 'civic-blue',
    name: 'シビックブルー',
    tag: '行政・公共感',
    desc: '公共・官公庁を想起させる落ち着いたロイヤルブルー',
    colors: { primary: '#1E3A8A', accent: '#3B82F6', bg: '#EFF6FF', surface: '#FFFFFF', text: '#1E2E50', sub: '#6B80A8' },
    style: { fontFamily: '"Noto Sans JP", sans-serif', borderRadius: '4px', headerStyle: 'solid', heroLayout: 'fullbg' },
  },
  {
    id: 'steel-sharp',
    name: 'スティールシャープ',
    tag: '都会的・スマート',
    desc: 'スチールグレーで都会的でスマート。シャープな第一印象',
    colors: { primary: '#374151', accent: '#6B7280', bg: '#F9FAFB', surface: '#FFFFFF', text: '#111827', sub: '#9CA3AF' },
    style: { fontFamily: '"Noto Sans JP", sans-serif', borderRadius: '2px', headerStyle: 'bordered', heroLayout: 'split' },
  },
  {
    id: 'ocean-deep',
    name: 'オーシャンディープ',
    tag: '信頼・開放感',
    desc: '深い海をイメージした爽やかで開放感のあるブルー',
    colors: { primary: '#0369A1', accent: '#0EA5E9', bg: '#F0F9FF', surface: '#FFFFFF', text: '#0C2A3E', sub: '#5B8CAA' },
    style: { fontFamily: '"Noto Sans JP", sans-serif', borderRadius: '10px', headerStyle: 'solid', heroLayout: 'fullbg' },
  },
  {
    id: 'indigo-bold',
    name: 'インディゴボールド',
    tag: '力強さ・信頼',
    desc: '鮮やかなインディゴで力強さと信頼感を印象付ける',
    colors: { primary: '#3730A3', accent: '#6366F1', bg: '#EEF2FF', surface: '#FFFFFF', text: '#1E1B4B', sub: '#6B7280' },
    style: { fontFamily: '"Noto Sans JP", sans-serif', borderRadius: '6px', headerStyle: 'solid', heroLayout: 'left' },
  },
  {
    id: 'white-clean',
    name: 'ホワイトクリーン',
    tag: 'シンプル・清潔',
    desc: '白を基調にした究極にシンプルなデザイン。内容で勝負',
    colors: { primary: '#374151', accent: '#2563EB', bg: '#FFFFFF', surface: '#FFFFFF', text: '#1F2937', sub: '#9CA3AF' },
    style: { fontFamily: '"Noto Sans JP", sans-serif', borderRadius: '8px', headerStyle: 'minimal', heroLayout: 'left' },
  },
  {
    id: 'white-serif',
    name: 'ホワイトセリフ',
    tag: '上品・端正',
    desc: '白地に明朝体で端正な印象。格式と読みやすさを両立',
    colors: { primary: '#1F2937', accent: '#4B5563', bg: '#FAFAFA', surface: '#FFFFFF', text: '#111827', sub: '#6B7280' },
    style: { fontFamily: '"Noto Serif JP", serif', borderRadius: '4px', headerStyle: 'bordered', heroLayout: 'center' },
  },

  // ── 写真ヒーロー: 相談シーン (33945329_s.jpg) ──
  {
    id: 'consult-warm',
    name: 'コンサルトウォーム',
    tag: '親しみ・相談',
    desc: '相談風景の写真で親しみやすさと安心感を演出',
    colors: { primary: '#2563EB', accent: '#60A5FA', bg: '#F8FAFF', surface: '#FFFFFF', text: '#1E293B', sub: '#64748B' },
    style: { fontFamily: '"Noto Sans JP", sans-serif', borderRadius: '10px', headerStyle: 'minimal', heroLayout: 'left' },
  },

  // ── 写真ヒーロー: ビル街で会話 (34039686_s.jpg) ──
  {
    id: 'city-trust',
    name: 'シティトラスト',
    tag: '都会的・信頼',
    desc: 'ビル街の会話シーンで都会的な信頼感を演出',
    colors: { primary: '#1E40AF', accent: '#3B82F6', bg: '#EFF6FF', surface: '#FFFFFF', text: '#1E3A5F', sub: '#6B80A8' },
    style: { fontFamily: '"Noto Sans JP", sans-serif', borderRadius: '6px', headerStyle: 'solid', heroLayout: 'left' },
  },
  {
    id: 'city-modern',
    name: 'シティモダン',
    tag: '洗練・スマート',
    desc: 'ビル街の会話シーン×モノトーンで洗練されたスマートさ',
    colors: { primary: '#18181B', accent: '#71717A', bg: '#FAFAFA', surface: '#FFFFFF', text: '#09090B', sub: '#A1A1AA' },
    style: { fontFamily: '"Noto Sans JP", sans-serif', borderRadius: '4px', headerStyle: 'minimal', heroLayout: 'center' },
  },

  // ── 写真ヒーロー: 高層ビル (34156942_s.jpg) ──
  {
    id: 'tower-navy',
    name: 'タワーネイビー',
    tag: '格式・プロ',
    desc: '高層ビル×ネイビーで堂々とした格式とプロフェッショナル感',
    colors: { primary: '#1E3A8A', accent: '#2563EB', bg: '#EFF6FF', surface: '#FFFFFF', text: '#1E2E50', sub: '#6B80A8' },
    style: { fontFamily: '"Noto Serif JP", serif', borderRadius: '4px', headerStyle: 'solid', heroLayout: 'left' },
  },
  {
    id: 'tower-slate',
    name: 'タワースレート',
    tag: '都会的・先進',
    desc: '高層ビル×スレートグレーで先進的な都会のイメージ',
    colors: { primary: '#334155', accent: '#94A3B8', bg: '#F8FAFC', surface: '#FFFFFF', text: '#0F172A', sub: '#94A3B8' },
    style: { fontFamily: '"Noto Sans JP", sans-serif', borderRadius: '6px', headerStyle: 'minimal', heroLayout: 'center' },
  },
]
