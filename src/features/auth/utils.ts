import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const protectServer = async () => {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin')
  }
}

export const currentUser = async () => {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin')
  }

  return session?.user
}
