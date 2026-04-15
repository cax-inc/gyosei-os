'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  pageId: string
  keyword: string
}

export function SeoPageDelete({ pageId, keyword }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`「${keyword}」のページを削除しますか？`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/seo/${pageId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      alert('削除に失敗しました')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50"
    >
      {deleting ? '削除中…' : '削除'}
    </button>
  )
}
