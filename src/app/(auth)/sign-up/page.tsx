'use client'

import { SignUpCard } from '@/features/auth/components/sign-up-card'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

const SignUpPage = () => {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') window.location.href = '/'
  }, [session, status])

  return <SignUpCard />
}

export default SignUpPage
