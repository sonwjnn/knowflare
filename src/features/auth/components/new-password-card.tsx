'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { useNewPassword } from '../hooks/use-new-password'

export const NewPasswordCard = () => {
  const router = useRouter()

  const { mutate: newPassword, isPending: newPasswordLoading } =
    useNewPassword()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [password, setPassword] = useState<string | undefined>()
  const [confirmPassword, setConfirmPassword] = useState<string | undefined>()

  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (success || error) return

    if (!token) {
      setError('Missing token!')
      return
    }

    if (!password || !confirmPassword) {
      setError('Missing fileds!')
      return
    }

    if (password !== confirmPassword) {
      setError('Confirm password not match!')
      return
    }

    newPassword(
      { token, password },
      {
        onSuccess: () => {
          router.replace('/sign-in')
          setSuccess('Password resetted!')
        },
        onError: () => {
          setError('Something went wrong!')
        },
      }
    )
  }

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Confirming your password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onSubmit} className="space-y-2.5">
          <Input
            value={password}
            disabled={newPasswordLoading}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Input
            value={confirmPassword}
            disabled={newPasswordLoading}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="confirmPassword"
            type="password"
            required
          />
          <Button
            className="w-full"
            type="submit"
            size="lg"
            disabled={newPasswordLoading}
          >
            {newPasswordLoading ? (
              <Loader2 className="left-2.5 top-2.5 mr-2 size-5 animate-spin" />
            ) : (
              'Reset password'
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          Back to Login?{' '}
          <Link href="/sign-in">
            <span className="text-sky-700 hover:underline">Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
