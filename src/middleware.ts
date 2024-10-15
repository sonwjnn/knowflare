import AuthConfig from '@/auth.config'
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  apiWebhooksPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes'
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(AuthConfig)

export default auth(req => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiRequest = nextUrl.pathname.startsWith('/api')
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isApiWebhooksRoute = nextUrl.pathname.startsWith(apiWebhooksPrefix)

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (req.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  if (isApiAuthRoute || isApiWebhooksRoute || isApiRequest) {
    return NextResponse.next()
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn && !isPublicRoute) {
    const isSignInRoute = nextUrl.pathname.includes('/sign-in')
    if (isSignInRoute) {
      return NextResponse.next()
    }

    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    return NextResponse.redirect(
      new URL(`/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    )
  }

  return NextResponse.next()
})
