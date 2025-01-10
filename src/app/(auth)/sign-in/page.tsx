'use client'

import { SignInCard } from '@/features/auth/components/sign-in-card'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

const SignInPage = () => {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' || session) window.location.href = '/'
  }, [session, status])

  return <SignInCard />
}

export default SignInPage
