import { auth } from '@/auth'
import { CustomUserSession } from '@/types'
import { getAuthUser } from '@hono/auth-js'
import { MiddlewareHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

export const protectAdmin = async () => {
  const session = await auth()

  if (!session) {
    redirect('/sign-in')
  }

  if (session?.user?.role !== 'admin') {
    return notFound()
  }
}

export const currentUser = async () => {
  const session = await auth()

  if (!session) {
    redirect('/sign-in')
  }

  return session?.user
}

export function isAdmin(): MiddlewareHandler {
  return async (c, next) => {
    const authUser = await getAuthUser(c)
    const isAuth = !!authUser?.token || !!authUser?.user

    if (!isAuth) {
      const res = new Response('Unauthorized', {
        status: 401,
      })
      throw new HTTPException(401, { res })
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${authUser.token?.id}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )

    if (!res.ok) {
      const newRes = new Response('Unauthorized', {
        status: 401,
      })
      throw new HTTPException(401, { res: newRes })
    }

    const user = (await res.json()) as CustomUserSession

    if (!user || user.role !== 'admin') {
      const newRes = new Response('Unauthorized', {
        status: 401,
      })
      throw new HTTPException(401, { res: newRes })
    }

    c.set('authUser', authUser)

    await next()
  }
}
