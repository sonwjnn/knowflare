'use client'

import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const SignInPage = () => {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (!(status === 'loading') && !session)
      void signIn('google', {
        callbackUrl: DEFAULT_LOGIN_REDIRECT || '/',
      })
    if (session) {
      window.close()
    }
  }, [session, status])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        left: 0,
        top: 0,
        background: 'white',
      }}
    ></div>
  )
}

export default SignInPage
