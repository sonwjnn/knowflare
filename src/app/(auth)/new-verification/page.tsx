import { auth } from '@/auth'
import { NewVerificationCard } from '@/features/auth/components/new-verification-card'
import { redirect } from 'next/navigation'

const NewVerificationPage = async () => {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  return <NewVerificationCard />
}

export default NewVerificationPage
