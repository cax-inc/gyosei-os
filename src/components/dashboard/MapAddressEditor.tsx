'use client'

import { useState } from 'react'

interface Props {
  slug: string
  initial: string
}

export function MapAddressEditor({ slug, initial }: Props) {
  const [address, setAddress] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    const res = await fetch(`/api/dashboard/${slug}/map`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: address || undefined }),
    })
    setSaving(false)
    if (res.ok) setSaved(true)
  }

  const mapSrc = address
    ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`
    : null

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-900">Googleマップ設定</h2>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-xs text-gray-500">
          事務所の住所を入力するとサイトにGoogleマップが表示されます。空欄にするとマップは非表示になります。
        </p>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            事務所住所
          </label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="例: 東京都千代田区霞が関1-1-1"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        {mapSrc && (
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <iframe
              src={mapSrc}
              width="100%"
              height="200"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {saving ? '保存中…' : '保存する'}
          </button>
          {saved && <span className="text-xs text-green-600 font-medium">✓ 保存しました</span>}
        </div>
      </div>
    </div>
  )
}
