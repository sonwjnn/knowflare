'use client'

import { FormError } from '@/components/form-error'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Separator } from '@/components/ui/separator'
import { useSignIn } from '@/features/auth/api/use-sign-in'
import { errorMonitor } from 'events'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

export const SignInCard = () => {
  const searchParams = useSearchParams()
  const { mutate: signInMutate, isPending: signInLoading } = useSignIn()
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [error, setError] = useState<string | undefined>('')

  const [loading, setLoading] = useState(false)
  const [loadingGithub, setLoadingGithub] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [success, setSuccess] = useState('')

  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const urlError1 =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : ''
  const urlError2 =
    searchParams.get('error') === 'Configuration' ? 'Invalid password!' : ''

  const popupCenter = (url: string, title: string) => {
    const dualScreenLeft = window.screenLeft ?? window.screenX
    const dualScreenTop = window.screenTop ?? window.screenY

    const width =
      window.innerWidth ?? document.documentElement.clientWidth ?? screen.width

    const height =
      window.innerHeight ??
      document.documentElement.clientHeight ??
      screen.height

    const systemZoom = width / window.screen.availWidth

    const left = (width - 500) / 2 / systemZoom + dualScreenLeft
    const top = (height - 550) / 2 / systemZoom + dualScreenTop

    const newWindow = window.open(
      url,
      title,
      `width=${500 / systemZoom},height=${
        550 / systemZoom
      },top=${top},left=${left}`
    )

    newWindow?.focus()
  }

  const onCredentialSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    signInMutate(
      {
        email: email,
        password: password,
        callbackUrl,
        code,
      },
      {
        onSuccess: data => {
          if ('error' in data) {
            setEmail('')
            setPassword('')
            setCode('')
            setError(data.error)
          } else if ('data' in data) {
            if (data.data.success) {
              setCode('')
              setError('')

              setSuccess(data.data.success)
            }
            if (data.data.twoFactor) {
              setError('')
              setShowTwoFactor(true)
            }
            if (data.data.canLogin) {
              setError('')
              signIn('credentials', {
                email: email,
                password: password,
                callbackUrl: '/',
              })
            }
          }
        },
        onError: err => {
          setCode('')
          setError(err.message)
        },
      }
    )
  }

  const onProviderSignIn = (provider: 'github' | 'google') => {
    setLoading(true)
    setLoadingGithub(provider === 'github')
    setLoadingGoogle(provider === 'google')
    popupCenter(`/auth-signin/${provider}`, 'Sample Sign In')
  }

  return (
    <Card className="w-full rounded-xl bg-white/95 p-8 shadow-xl backdrop-blur-sm">
      <CardHeader className="space-y-3">
        <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-center text-3xl font-bold text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Sign in to your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={onCredentialSignIn} className="space-y-4">
          {showTwoFactor ? (
            <div className="flex items-center justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={code => setCode(code)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          ) : (
            <>
              <Input
                value={email}
                disabled={signInLoading}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                required
                className="h-12 rounded-lg border-gray-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                value={password}
                disabled={signInLoading}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                required
                className="h-12 rounded-lg border-gray-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </>
          )}

          <Button
            className="h-12 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white transition-all duration-300 hover:opacity-90"
            type="submit"
            disabled={signInLoading}
          >
            {signInLoading ? (
              <Loader2 className="mr-2 size-5 animate-spin" />
            ) : (
              'Continue'
            )}
          </Button>
        </form>

        <div className="flex items-center justify-center">
          <Link
            href="/reset"
            className="text-sm text-gray-600 transition-colors hover:text-blue-600"
          >
            Forgot a password?
          </Link>
        </div>

        <FormError message={error || urlError1 || urlError2} />

        <Separator className="my-6" />

        <div className="space-y-3">
          <Button
            onClick={() => onProviderSignIn('google')}
            variant="outline"
            className="h-12 w-full rounded-lg border-gray-200 transition-colors hover:bg-gray-50"
            disabled={loading || signInLoading}
          >
            {loadingGoogle ? (
              <Loader2 className="mr-2 size-5 animate-spin" />
            ) : (
              <FcGoogle className="mr-2 size-5" />
            )}
            Continue with Google
          </Button>
          <Button
            onClick={() => onProviderSignIn('github')}
            variant="outline"
            disabled={loading || signInLoading}
            className="h-12 w-full rounded-lg border-gray-200 transition-colors hover:bg-gray-50"
          >
            {loadingGithub ? (
              <Loader2 className="mr-2 size-5 animate-spin" />
            ) : (
              <FaGithub className="mr-2 size-5" />
            )}
            Continue with Github
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            onClick={() => setLoading(true)}
            className="text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
