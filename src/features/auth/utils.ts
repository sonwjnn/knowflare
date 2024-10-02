import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const protectServer = async () => {
  const session = await auth()

  if (!session) {
    redirect('/sign-in')
  }
}

export const currentUser = async () => {
  const session = await auth()

  if (!session) {
    redirect('/sign-in')
  }

  return session?.user
}
