'use client'

import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { useReset } from '../hooks/use-reset'

export const ResetCard = () => {
  const { mutate: reset, isPending: resetLoading } = useReset()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [email, setEmail] = useState<string | undefined>('')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) return

    reset(
      {
        email,
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

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Forgot your password?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onSubmit} className="space-y-2.5">
          <div className="space-y-4">
            <Input
              value={email}
              disabled={resetLoading}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              required
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" disabled={resetLoading} className="w-full">
            {resetLoading ? (
              <Loader className="mr-2 size-4 animate-spin text-muted-foreground" />
            ) : null}
            Send reset email
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register">
            <span className="text-sky-700 hover:underline">Register</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
