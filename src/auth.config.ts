import { db } from '@/db/drizzle'
import { users } from '@/db/schema'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { NextAuthConfig } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { z } from 'zod'

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

declare module 'next-auth/jwt' {
  interface JWT {
    id: string | undefined
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string | undefined
  }
}

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
    GitHub,
    Google,
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
      }

      return session
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }

      return token
    },
  },
} satisfies NextAuthConfig
