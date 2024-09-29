'use client'

import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useSignUp } from '@/features/auth/hooks/use-sign-up'
import { Loader2, TriangleAlert } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

export const SignUpCard = () => {
  const mutation = useSignUp()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loadingGithub, setLoadingGithub] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onCredentialSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutation.mutate(
      {
        name,
        email,
        password,
      },
      {
        onSuccess: data => {
          setSuccess('Confirmation email sent!')
        },
        onError: () => {
          setError('Something went wrong!')
        },
      }
    )
  }

  const onProviderSignUp = (provider: 'github' | 'google') => {
    setLoading(true)
    setLoadingGithub(provider === 'github')
    setLoadingGoogle(provider === 'google')
    signIn(provider, { callbackUrl: '/' })
  }

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!mutation.error && (
        <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p className="mx-2">Something went wrong</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onCredentialSignUp} className="space-y-2.5">
          <Input
            disabled={mutation.isPending}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full name"
            type="text"
            required
          />
          <Input
            disabled={mutation.isPending}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={mutation.isPending}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            minLength={3}
            maxLength={20}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            className="w-full"
            type="submit"
            size="lg"
            disabled={loading || mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="left-2.5 top-2.5 mr-2 size-5 animate-spin" />
            ) : (
              'Continue'
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">
          <Link href="/reset">
            <span className="text-sky-700 hover:underline">
              Forgot a password?
            </span>
          </Link>
        </p>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            onClick={() => onProviderSignUp('google')}
            size="lg"
            variant="outline"
            className="relative w-full"
            disabled={loading || mutation.isPending}
          >
            {loadingGoogle ? (
              <Loader2 className="absolute left-2.5 top-2.5 mr-2 size-5 animate-spin" />
            ) : (
              <FcGoogle className="absolute left-2.5 top-2.5 mr-2 size-5" />
            )}
            Continue with Google
          </Button>
          <Button
            onClick={() => onProviderSignUp('github')}
            size="lg"
            variant="outline"
            disabled={loading || mutation.isPending}
            className="relative w-full"
          >
            {loadingGithub ? (
              <Loader2 className="absolute left-2.5 top-2.5 mr-2 size-5 animate-spin" />
            ) : (
              <FaGithub className="absolute left-2.5 top-2.5 mr-2 size-5" />
            )}
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" onClick={() => setLoading(true)}>
            <span className="text-sky-700 hover:underline">Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
