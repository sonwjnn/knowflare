import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { stripe } from '@/lib/stripe'
import { ArrowLeft, CheckCircle, RotateCw, XCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  searchParams: {
    success?: string
    error?: string
    session_id?: string
  }
}

export default async function CheckoutResult({ searchParams }: Props) {
  if (!searchParams?.session_id) {
    console.error('No session_id provided in searchParams:', searchParams)
    return notFound()
  }

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(
      searchParams?.session_id as string
    )
  } catch {
    return notFound()
  }

  if (session?.metadata?.productIds == null) return notFound()

  const isSuccess = searchParams?.success && !!session.metadata.productIds
  const isError = searchParams?.error

  return (
    <div className="mt-16 flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg transition-all duration-500 ease-out">
        <div className="flex flex-col items-center text-center">
          {isSuccess ? (
            <>
              <div className="relative mb-4">
                <svg className="h-24 w-24">
                  <circle
                    className="text-gray-300"
                    strokeWidth="5"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-green-600 transition-all duration-1000 ease-out"
                    strokeWidth="5"
                    strokeDasharray={283}
                    strokeDashoffset={283 - (283 * 100) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <CheckCircle className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform text-green-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Payment Successful
              </h2>
              <p className="mb-6 text-gray-600">
                Thank you for your purchase! Your transaction has been completed
                successfully.
              </p>
            </>
          ) : (
            <>
              <div className="mb-4 rounded-full bg-red-100 p-3">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Payment Failed
              </h2>
              <p className="mb-6 text-gray-600">
                We encountered an issue processing your payment. Please try
                again or contact support.
              </p>
            </>
          )}
          <div className="flex w-full flex-col gap-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
              </Link>
            </Button>
            {!isSuccess && (
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                <RotateCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
