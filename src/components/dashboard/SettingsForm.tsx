'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  slug: string
  firmName: string
  ownerName: string
  ownerEmail: string
  autoReply: boolean
  plan: string | null
  hasStripe: boolean
}

export function SettingsForm({ slug, firmName, ownerName, ownerEmail, autoReply, plan, hasStripe }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({ firmName, ownerName })
  const [autoReplyOn, setAutoReplyOn] = useState(autoReply)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await fetch(`/api/dashboard/${slug}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firmName: form.firmName, ownerName: form.ownerName, autoReply: autoReplyOn }),
    })
    setSaving(false)
    setSaved(true)
    router.refresh()
  }

  async function handleStripePortal() {
    setPortalLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json() as { url?: string }
    if (data.url) {
      window.location.href = data.url
    }
    setPortalLoading(false)
  }

  const planLabel = plan === 'monthly' ? '月額プラン' : plan === 'annual' ? '年額プラン' : '無料'

  return (
    <div className="space-y-6 max-w-xl">
      {/* アカウント情報 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">アカウント情報</h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">事務所名</label>
            <input
              type="text"
              value={form.firmName}
              onChange={e => setForm(prev => ({ ...prev, firmName: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">代表者名</label>
            <input
              type="text"
              value={form.ownerName}
              onChange={e => setForm(prev => ({ ...prev, ownerName: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">メールアドレス</label>
            <p className="text-sm text-gray-600">{ownerEmail}</p>
            <p className="text-xs text-gray-400 mt-1">メールアドレスの変更はお問い合わせください</p>
          </div>
        </div>
      </div>

      {/* 通知設定 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">通知設定</h2>
        </div>
        <div className="p-5">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-700">問い合わせ自動返信</p>
              <p className="text-xs text-gray-400 mt-0.5">問い合わせがあった際に、相談者へ自動で返信メールを送信します</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoReplyOn(!autoReplyOn)}
              className={`relative w-11 h-6 rounded-full transition-colors ${autoReplyOn ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoReplyOn ? 'translate-x-5' : ''}`} />
            </button>
          </label>
        </div>
      </div>

      {/* 保存ボタン */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {saving ? '保存中...' : '変更を保存'}
        </button>
        {saved && <span className="text-xs text-green-600 font-medium">保存しました</span>}
      </div>

      {/* プラン情報 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">プラン</h2>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">現在のプラン</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{planLabel}</p>
            </div>
            {hasStripe && (
              <button
                onClick={handleStripePortal}
                disabled={portalLoading}
                className="text-xs text-indigo-600 font-semibold hover:underline disabled:opacity-50"
              >
                {portalLoading ? '...' : 'プラン・支払い管理 →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
