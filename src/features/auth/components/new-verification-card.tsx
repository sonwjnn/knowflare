'use client'

import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { useNewVerification } from '../hooks/use-new-verification'

export const NewVerificationCard = () => {
  const { mutate: newVerification, isPending: newVerificationLoading } =
    useNewVerification()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  const onSubmit = useCallback(() => {
    if (success || error) return

    if (!token) {
      setError('Missing token!')
      return
    }

    newVerification(
      { token },
      {
        onSuccess: data => {
          setSuccess('Email verifired!')
        },
        onError: () => {
          setError('Something went wrong!')
        },
      }
    )
  }, [token, success, error, newVerification])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Confirming your verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <div className="flex w-full items-center justify-center">
          {!success && !error && !newVerificationLoading && (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          )}
          <FormSuccess message={success} />
          {!success && <FormError message={error} />}
        </div>

        <p className="text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in">
            <span className="text-sky-700 hover:underline">Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
