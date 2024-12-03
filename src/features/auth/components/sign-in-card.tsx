'use client'

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
import { Loader2, TriangleAlert } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { setErrorMap } from 'zod'

import { useSignIn } from '../api/use-sign-in'

export const SignInCard = () => {
    // Loading
    const { mutate: signInMutate, isPending: signInLoading } = useSignIn()

    const [loading, setLoading] = useState(false)
    const [loadingGithub, setLoadingGithub] = useState(false)
    const [loadingGoogle, setLoadingGoogle] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const params = useSearchParams()
    const error = params.get('error')
    const callbackUrl = params.get('callbackUrl') || '/'

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
            `width=${500 / systemZoom},height=${550 / systemZoom
            },top=${top},left=${left}`
        )

        newWindow?.focus()
    }

    const onCredentialSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        signInMutate({
            email: email,
            password: password,
            callbackUrl,
        })
    }

    const onProviderSignIn = (provider: 'github' | 'google') => {
        setLoading(true)
        setLoadingGithub(provider === 'github')
        setLoadingGoogle(provider === 'google')
        popupCenter(`/auth-signin/${provider}`, 'Sample Sign In')
    }

    return (
        <Card className="w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8">
            <CardHeader className="space-y-3">
                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome Back
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                    Sign in to your account
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <form onSubmit={onCredentialSignIn} className="space-y-4">
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
                    <Button
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all duration-300 rounded-lg text-white font-semibold"
                        type="submit"
                        disabled={loading}
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
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Forgot a password?
                    </Link>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                    <Button
                        onClick={() => onProviderSignIn('google')}
                        variant="outline"
                        className="w-full h-12 border-gray-200 hover:bg-gray-50 transition-colors rounded-lg"
                        disabled={loading}
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
                        disabled={loading}
                        className="w-full h-12 border-gray-200 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                        {loadingGithub ? (
                            <Loader2 className="mr-2 size-5 animate-spin" />
                        ) : (
                            <FaGithub className="mr-2 size-5" />
                        )}
                        Continue with Github
                    </Button>
                </div>

                <p className="text-sm text-center text-gray-600">
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
