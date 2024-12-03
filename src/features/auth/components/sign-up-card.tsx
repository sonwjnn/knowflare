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
import { useSignUp } from '@/features/auth/api/use-sign-up'
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

    const onCredentialSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError('')
        setSuccess('')

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
        setError('')
        setSuccess('')
        setLoadingGithub(provider === 'github')
        setLoadingGoogle(provider === 'google')
        popupCenter(`/auth-signin/${provider}`, 'Sample Sign In')
    }

    return (
        <Card className="w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8">
            <CardHeader className="space-y-3">
                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Create an Account
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                    Use your email or another service to continue
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <form onSubmit={onCredentialSignUp} className="space-y-4">
                    <Input
                        disabled={mutation.isPending}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Full name"
                        type="text"
                        required
                        className="h-12 rounded-lg border-gray-200 bg-white/50 backdrop-blur-sm focus:border-green-500 focus:ring-green-500"
                    />
                    <Input
                        disabled={mutation.isPending}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        required
                        className="h-12 rounded-lg border-gray-200 bg-white/50 backdrop-blur-sm focus:border-green-500 focus:ring-green-500"
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
                        className="h-12 rounded-lg border-gray-200 bg-white/50 backdrop-blur-sm focus:border-green-500 focus:ring-green-500"
                    />
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90 transition-all duration-300 rounded-lg text-white font-semibold"
                        type="submit"
                        size="lg"
                        disabled={loading || mutation.isPending}
                    >
                        {mutation.isPending ? (
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
                        onClick={() => onProviderSignUp('google')}
                        size="lg"
                        variant="outline"
                        className="w-full h-12 border-gray-200 hover:bg-gray-50 transition-colors rounded-lg"
                        disabled={loading || mutation.isPending}
                    >
                        {loadingGoogle ? (
                            <Loader2 className="mr-2 size-5 animate-spin" />
                        ) : (
                            <FcGoogle className="mr-2 size-5" />
                        )}
                        Continue with Google
                    </Button>
                    <Button
                        onClick={() => onProviderSignUp('github')}
                        size="lg"
                        variant="outline"
                        disabled={loading || mutation.isPending}
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
                    Already have an account?{' '}
                    <Link
                        href="/sign-in"
                        onClick={() => setLoading(true)}
                        className="text-blue-600 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </CardContent>
        </Card>
    )
}
