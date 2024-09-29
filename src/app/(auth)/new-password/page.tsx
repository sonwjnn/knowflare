import { auth } from '@/auth'
import { NewPasswordCard } from '@/features/auth/components/new-password-card'
import { redirect } from 'next/navigation'

const NewPasswordPage = async () => {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  return <NewPasswordCard />
}

export default NewPasswordPage
