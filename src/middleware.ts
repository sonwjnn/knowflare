import authConfig from '@/auth.config'
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from '@/routes'
import NextAuth from 'next-auth'

const { auth } = NextAuth(authConfig)

export const middleware = auth((req, ctx) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiRoute = nextUrl.pathname.startsWith('/api')
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiRoute) {
    return // No response means "continue the middleware chain"
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url))
    }
    return // Allow access to the route
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }

    console.log(callbackUrl)

    const encodedCallbackUrl = encodeURIComponent(callbackUrl)

    return Response.redirect(
      new URL(`/sign-in?callbackUrl=${encodedCallbackUrl}`, req.url)
    )
  }

  return // Allow access to the route
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
