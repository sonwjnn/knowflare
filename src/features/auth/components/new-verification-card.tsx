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
import { Loader, Loader2, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

import { useNewVerification } from '../hooks/use-new-verification'

export const NewVerificationCard = () => {
  // Loading
  const { mutate: newVerification, isPending: newVerificationLoading } =
    useNewVerification()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  const params = useSearchParams()

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
          {!success && !error && (
            <Loader className="size-4 animate-spin text-muted-foreground" />
          )}
          <FormSuccess message={success} />
          {!success && <FormError message={error} />}
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
