import { db } from '@/db/drizzle'
import { UserRole, users } from '@/db/schema'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { z } from 'zod'

import { getAccountByUserId } from './db/queries'

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export default {
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validateFields = CredentialsSchema.safeParse(credentials)

        if (!validateFields.success) {
          return null
        }

        const { email, password } = validateFields.data

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/users/user/by-email?email=${encodeURIComponent(email)}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )

        if (!res.ok) return null

        const { data: user } = (await res.json()) as {
          data: typeof users.$inferSelect
        }

        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) return null

        return user
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  events: {
    async linkAccount({ user }) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailVerified: new Date() }),
      })
    },
  },
  callbacks: {
    session({ session, token }) {
      if (token.role && session.user) {
        session.user.role = token.role as UserRole
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }

      if (token.id) {
        session.user.id = token.id
        session.user.name = token.name as string
        session.user.image = token.image as string
        session.user.email = token.email as string
        session.user.bio = token.bio as string
        session.user.fullName = token.fullName as string
        session.user.isOAuth = token.isOAuth as boolean
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
      }

      if (trigger === 'update') {
        return { ...token, ...session }
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${token.id}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!res.ok) return token

      const { data: existingUser } = (await res.json()) as {
        data: typeof users.$inferSelect
      }

      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.image = existingUser.image as string
      token.email = existingUser.email
      token.role = existingUser.role
      token.bio = existingUser.bio as string
      token.fullName = existingUser.fullName as string
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      return token
    },
  },
} satisfies NextAuthConfig
