'use client'

import { SignInCard } from '@/features/auth/components/sign-in-card'
import { BroadcastChannel } from 'broadcast-channel'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

const SignInPage = () => {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' || session) window.location.href = '/'
  }, [session, status])

  const channel = new BroadcastChannel('auth_channel')

  useEffect(() => {
    const handleSessionUpdate = (message: { event: string; data: any }) => {
      if (message.event === 'session_update') {
        window.location.href = '/' // Reload để đồng bộ session
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
