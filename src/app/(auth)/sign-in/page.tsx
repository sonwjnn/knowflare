'use client'

import { SignInCard } from '@/features/auth/components/sign-in-card'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { BroadcastChannel } from 'broadcast-channel'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const SignInPage = () => {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const decodedCallbackUrl = callbackUrl
    ? decodeURIComponent(callbackUrl)
    : undefined

  useEffect(() => {
    if (status === 'authenticated' || session)
      window.location.href = decodedCallbackUrl || DEFAULT_LOGIN_REDIRECT
  }, [session, status, decodedCallbackUrl])

  const channel = new BroadcastChannel('auth_channel')

  useEffect(() => {
    const handleSessionUpdate = (message: { event: string; data: any }) => {
      if (message.event === 'session_update') {
        window.location.href = decodedCallbackUrl || DEFAULT_LOGIN_REDIRECT
      }
    }

    channel.onmessage = handleSessionUpdate

    return () => {
      channel.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <SignInCard />
}

export default SignInPage
