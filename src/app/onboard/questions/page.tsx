import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { QuestionWizard } from '@/components/onboard/QuestionWizard'

export default async function QuestionsPage() {
  const session = await getSession()
  if (!session) redirect('/onboard/auth')

  return <QuestionWizard ownerEmail={session.email} />
}
