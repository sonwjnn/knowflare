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

        const query = await db
          .select()
          .from(users)
          .where(eq(users.email, email))

        const user = query[0]

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
  callbacks: {
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id
        session.user.name = token.name as string
        session.user.image = token.image as string
        session.user.email = token.email as string
        session.user.role = token.role as UserRole
      }

      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${token.id}`
      )

      if (!res.ok) return token

      const existingUser = await res.json()
      token.name = existingUser.name as string
      token.image = existingUser.image as string
      token.email = existingUser.email as string
      token.role = existingUser.role as UserRole

      return token
    },
  },
} satisfies NextAuthConfig
