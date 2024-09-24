import { db } from '@/db/drizzle'
import { getVerificationTokenByToken } from '@/db/queries'
import { users, verificationTokens } from '@/db/schema'
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

      return c.json(null, 200)
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

      return c.json(null, 200)
    }
  )
  .post(
    '/new-verification',
    zValidator(
      'json',
      z.object({
        token: z.string(),
      })
    ),
    async c => {
      const { token } = c.req.valid('json')

      const existingToken = await getVerificationTokenByToken(token)

      if (!existingToken) {
        return c.json({ error: 'Token does not exist!' }, 400)
      }

      const hasExpired = new Date(existingToken.expires) < new Date()

      if (hasExpired) {
        return c.json({ error: 'Token has expired!' }, 400)
      }

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, existingToken.email))

      if (!existingUser) {
        return c.json({ error: 'Email does not exist!' }, 400)
      }

      await db
        .update(users)
        .set({
          emailVerified: new Date(),
          email: existingToken.email,
        })
        .where(eq(users.id, existingUser.id))

      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.token, existingToken.token))

      return c.json(null, 200)
    }
  )

export default app
