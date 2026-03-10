export interface Prefecture {
  name: string
  cities?: string[]
}

export interface Region {
  name: string
  prefectures: Prefecture[]
}

export const AREA_REGIONS: Region[] = [
  {
    name: '北海道・東北',
    prefectures: [
      { name: '北海道', cities: ['札幌市', '旭川市', '函館市', '小樽市', '苫小牧市'] },
      { name: '青森県' },
      { name: '岩手県' },
      { name: '宮城県', cities: ['仙台市', '石巻市'] },
      { name: '秋田県' },
      { name: '山形県' },
      { name: '福島県' },
    ],
  },
  {
    name: '関東',
    prefectures: [
      { name: '茨城県' },
      { name: '栃木県' },
      { name: '群馬県' },
      { name: '埼玉県', cities: ['さいたま市', '川口市', '川越市', '所沢市', '越谷市', '草加市', '春日部市', '熊谷市'] },
      { name: '千葉県', cities: ['千葉市', '船橋市', '松戸市', '市川市', '柏市', '市原市', '浦安市', '流山市'] },
      { name: '東京都', cities: ['千代田区', '中央区', '港区', '新宿区', '文京区', '台東区', '墨田区', '江東区', '品川区', '目黒区', '大田区', '世田谷区', '渋谷区', '中野区', '杉並区', '豊島区', '北区', '荒川区', '板橋区', '練馬区', '足立区', '葛飾区', '江戸川区', '八王子市', '立川市', '武蔵野市', '三鷹市', '町田市'] },
      { name: '神奈川県', cities: ['横浜市', '川崎市', '相模原市', '藤沢市', '平塚市', '厚木市', '横須賀市', '大和市'] },
    ],
  },
  {
    name: '中部',
    prefectures: [
      { name: '新潟県' },
      { name: '富山県' },
      { name: '石川県' },
      { name: '福井県' },
      { name: '山梨県' },
      { name: '長野県' },
      { name: '岐阜県' },
      { name: '静岡県' },
      { name: '愛知県', cities: ['名古屋市', '豊橋市', '岡崎市', '一宮市', '春日井市', '豊田市', '刈谷市'] },
    ],
  },
  {
    name: '近畿',
    prefectures: [
      { name: '三重県' },
      { name: '滋賀県' },
      { name: '京都府' },
      { name: '大阪府', cities: ['大阪市', '堺市', '豊中市', '吹田市', '高槻市', '枚方市', '東大阪市', '八尾市', '寝屋川市'] },
      { name: '兵庫県', cities: ['神戸市', '姫路市', '尼崎市', '明石市', '西宮市', '芦屋市', '宝塚市'] },
      { name: '奈良県' },
      { name: '和歌山県' },
    ],
  },
  {
    name: '中国・四国',
    prefectures: [
      { name: '鳥取県' },
      { name: '島根県' },
      { name: '岡山県' },
      { name: '広島県' },
      { name: '山口県' },
      { name: '徳島県' },
      { name: '香川県' },
      { name: '愛媛県' },
      { name: '高知県' },
    ],
  },
  {
    name: '九州・沖縄',
    prefectures: [
      { name: '福岡県', cities: ['福岡市', '北九州市', '久留米市', '飯塚市'] },
      { name: '佐賀県' },
      { name: '長崎県' },
      { name: '熊本県' },
      { name: '大分県' },
      { name: '宮崎県' },
      { name: '鹿児島県' },
      { name: '沖縄県' },
    ],
  },
]

const ALL_PREF_NAMES = AREA_REGIONS.flatMap(r => r.prefectures.map(p => p.name))

/** serviceAreas配列からDB保存用の都道府県名を1つ導出する */
export function derivePrefecture(serviceAreas: string[]): string {
  for (const area of serviceAreas) {
    if (ALL_PREF_NAMES.includes(area)) return area
  }
  // region → representative
  const regionMap: Record<string, string> = {
    '関東': '東京都', '近畿': '大阪府', '中部': '愛知県',
    '九州・沖縄': '福岡県', '北海道・東北': '北海道', '中国・四国': '広島県',
  }
  for (const area of serviceAreas) {
    if (regionMap[area]) return regionMap[area]
  }
  // city → parent prefecture
  for (const region of AREA_REGIONS) {
    for (const pref of region.prefectures) {
      if (pref.cities?.some(c => serviceAreas.includes(c))) return pref.name
    }
  }
  return '東京都'
}

/** サイトに表示するエリアラベルを生成 */
export function buildPrefectureLabel(serviceAreas: string[]): string {
  if (serviceAreas.includes('全国')) return '全国対応の行政書士'
  const prefs = serviceAreas.filter(a => ALL_PREF_NAMES.includes(a))
  if (prefs.length === 0) return '行政書士'
  if (prefs.length === 1) return `${prefs[0]}の行政書士`
  if (prefs.length <= 3) return `${prefs.join('・')}の行政書士`
  return `${prefs.slice(0, 2).join('・')}ほか${prefs.length - 2}エリアの行政書士`
}

/** serviceAreasを表示用テキストに変換（Area セクション用） */
export function buildAreaDisplayList(serviceAreas: string[]): string[] {
  if (serviceAreas.includes('全国')) return ['全国対応']
  // Expand regions to prefecture names
  const result: string[] = []
  for (const area of serviceAreas) {
    const region = AREA_REGIONS.find(r => r.name === area)
    if (region) {
      result.push(...region.prefectures.map(p => p.name))
    } else {
      result.push(area)
    }
  }
  return [...new Set(result)]
}
