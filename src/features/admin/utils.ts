import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

export const protectAdmin = async () => {
  const session = await auth()

  if (!session) {
    redirect('/sign-in')
  }

  if (session?.user?.role !== 'admin') {
    return notFound()
  }
}

export const currentUser = async () => {
  const session = await auth()

  if (!session) {
    redirect('/sign-in')
  }

  return session?.user
}
