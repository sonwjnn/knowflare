import { db } from '@/db/drizzle'
import { getVerificationTokenByToken } from '@/db/queries'
import {
  accounts,
  insertUsersSchema,
  passwordResetTokens,
  users,
  verificationTokens,
} from '@/db/schema'
import { isAdmin } from '@/features/admin/utils'
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/mail'
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from '@/lib/tokens'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get('/', async c => {
    const data = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        emailVerified: users.emailVerified,
        image: users.image,
      })
      .from(users)

    return c.json({ data })
  })
  .get(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      })
    ),
    async c => {
      const { id } = c.req.valid('param')

      const [user] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          emailVerified: users.emailVerified,
          image: users.image,
        })
        .from(users)
        .where(eq(users.id, id))

      if (!user) {
        return c.json({ error: 'User not found' }, 404)
      }

      return c.json(user, 200)
    }
  )
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

      const [data] = await db.select().from(users).where(eq(users.email, email))

      if (data) {
        return c.json({ error: 'Email already in use' }, 400)
      }

      await db.insert(users).values({
        email,
        name,
        password: hashedPassword,
        emailVerified: null,
      })

      const verificationToken = await generateVerificationToken(email)

      if (!verificationToken) {
        return c.json({ error: 'Error when generate verification token!' }, 400)
      }

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
      const { email } = c.req.valid('json')

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))

      if (!existingUser || !existingUser.password || !existingUser.email) {
        return c.json({ error: 'Email is not exist!' }, 400)
      }

      const [existingAccount] = await db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, existingUser.id))

      // is provider account, dont need to verify
      if (!existingUser.emailVerified && existingAccount) {
        await db
          .update(users)
          .set({
            emailVerified: new Date(),
          })
          .where(eq(users.id, existingUser.id))

        return c.json(null, 200)
      }

      if (!existingUser.emailVerified && !existingAccount) {
        const verificationToken = await generateVerificationToken(
          existingUser.email
        )

        if (!verificationToken) {
          return c.json(
            { error: 'Error when generate verification token!' },
            400
          )
        }

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
  .post(
    '/reset',
    zValidator(
      'json',
      z.object({
        email: z.string().email(),
      })
    ),
    async c => {
      const { email } = c.req.valid('json')

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))

      if (!existingUser) {
        return c.json({ error: 'Email does not exist!' }, 400)
      }

      const [existingAccount] = await db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, existingUser.id))

      if (existingAccount) {
        return c.json({ error: 'Email is provider account!' }, 400)
      }

      const passwordResetToken = await generatePasswordResetToken(email)

      if (!passwordResetToken) {
        return c.json(
          { error: 'Error when generate password reset token!' },
          400
        )
      }

      await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
      )

      return c.json(null, 200)
    }
  )
  .post(
    '/new-password',
    zValidator(
      'json',
      z.object({
        token: z.string(),
        password: z.string(),
      })
    ),
    async c => {
      const { token, password } = c.req.valid('json')

      const [existingToken] = await db
        .select()
        .from(passwordResetTokens)
        .where(eq(passwordResetTokens.token, token))

      if (!existingToken) {
        return c.json({ error: 'Invalid token!' }, 400)
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

      const hashedPassword = await bcrypt.hash(password, 10)

      await db
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id))

      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.token, existingToken.token))

      return c.json(null, 200)
    }
  )
  .patch(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      'json',
      z.object({
        emailVerified: z.string().optional(),
      })
    ),
    async c => {
      const values = c.req.valid('json')
      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Id is required!' }, 400)
      }

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))

      if (!existingUser) {
        return c.json({ error: 'User does not exist!' }, 400)
      }

      const [data] = await db
        .update(users)
        .set({
          ...values,
          emailVerified: values.emailVerified
            ? new Date(values.emailVerified)
            : null,
        })
        .where(eq(users.id, id))

      if (!data) {
        return c.json({ error: 'Error when update user' }, 404)
      }

      return c.json({ data })
    }
  )

export default app
