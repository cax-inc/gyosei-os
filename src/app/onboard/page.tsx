import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export default async function OnboardPage() {
  const session = await getSession()
  // セッションがあればウィザードへ、なければトップへ
  redirect(session ? '/onboard/questions' : '/')
}
