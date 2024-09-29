import { auth } from '@/auth'
import { ResetCard } from '@/features/auth/components/reset-card'
import { redirect } from 'next/navigation'

const ResetPage = async () => {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  return <ResetCard />
}

export default ResetPage
