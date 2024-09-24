import { db } from '@/db/drizzle'
import { users } from '@/db/schema'
import { sendVerificationEmail } from '@/lib/mail'
import { generateVerificationToken } from '@/lib/tokens'
import { zValidator } from '@hono/zod-validator'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { AuthError } from 'next-auth'
import { signIn } from 'next-auth/react'
import { z } from 'zod'

const app = new Hono()
  .post(
    '/register',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(3).max(20),
      })
    ),
    async c => {
      const { name, email, password } = c.req.valid('json')

      const hashedPassword = await bcrypt.hash(password, 12)

      const query = await db.select().from(users).where(eq(users.email, email))

      if (query[0]) {
        return c.json({ error: 'Email already in use' }, 400)
      }

      await db.insert(users).values({
        email,
        name,
        password: hashedPassword,
      })

      const verificationToken = await generateVerificationToken(email)

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      )

      return c.json({ success: 'Confirmation email sent!' })
    }
  )
  .post(
    '/login',
    zValidator(
      'json',
      z.object({
        email: z.string().email(),
        password: z.string().min(3).max(20),
        callbackUrl: z.string().optional(),
        code: z.string().optional(),
      })
    ),
    async c => {
      const { email, password, callbackUrl, code } = c.req.valid('json')

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))

      if (!existingUser || !existingUser.password || !existingUser.email) {
        return c.json({ error: 'Email is not exist!' }, 400)
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
          existingUser.email
        )

        await sendVerificationEmail(
          verificationToken.email,
          verificationToken.token
        )

        return c.json({ success: 'Confirmation email sent!' }, 200)
      }

      try {
        await signIn('credentials', {
          email,
          password,
          redirectTo: callbackUrl || '/',
        })
      } catch (error) {
        if (error instanceof AuthError) {
          switch (error.type) {
            case 'CredentialsSignin':
              return c.json({ error: 'Invalid credentials' }, 400)
            default:
              return c.json({ error: 'Something went wrong!' }, 400)
          }
        }

        throw error
      }

      return c.json({ success: 'Email sent' })
    }
  )

export default app
