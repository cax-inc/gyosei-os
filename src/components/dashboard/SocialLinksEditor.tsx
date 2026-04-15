'use client'

import { useState } from 'react'
import type { SocialLinks } from '@/lib/ai-site/types'

interface Props {
  slug: string
  initial: SocialLinks
}

export function SocialLinksEditor({ slug, initial }: Props) {
  const [line, setLine] = useState(initial.line ?? '')
  const [facebook, setFacebook] = useState(initial.facebook ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    const res = await fetch(`/api/dashboard/${slug}/social`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ social: { line: line || undefined, facebook: facebook || undefined } }),
    })
    setSaving(false)
    if (res.ok) setSaved(true)
  }

  const fields = [
    {
      key: 'line', label: 'LINE', placeholder: 'https://lin.ee/xxxxxxx',
      value: line, onChange: setLine,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#06C755"><path d="M12 2C6.48 2 2 6.03 2 11c0 3.27 1.82 6.14 4.58 7.89.2.12.29.35.22.57l-.55 2.01c-.08.3.22.56.5.42l2.33-1.22c.14-.07.3-.09.45-.05.62.17 1.28.27 1.97.27 5.52 0 10-4.03 10-9S17.52 2 12 2zm-3 13H7v-5h2v5zm3 0h-2v-5h2v5zm3 0h-2v-5h2v5z"/></svg>
      ),
    },
    {
      key: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/your-page',
      value: facebook, onChange: setFacebook,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
      ),
    },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-900">SNSリンク設定</h2>
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">月額プラン</span>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-xs text-gray-500">URLを入力するとサイトのフッターにアイコンが表示されます。不要な場合は空欄のままにしてください。</p>
        {fields.map(f => (
          <div key={f.key}>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              {f.icon}{f.label}
            </label>
            <input
              type="url"
              value={f.value}
              onChange={e => f.onChange(e.target.value)}
              placeholder={f.placeholder}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        ))}
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
