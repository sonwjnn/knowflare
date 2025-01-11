import { db } from '@/db/drizzle'
import {
  getTwoFactorTokenByEmail,
  getVerificationTokenByToken,
} from '@/db/queries'
import {
  UserRole,
  accounts,
  passwordResetTokens,
  twoFactorConfirmations,
  twoFactorTokens,
  users,
  verificationTokens,
} from '@/db/schema'
import {
  sendPasswordResetEmail,
  sendTwoFactorEmail,
  sendVerificationEmail,
} from '@/lib/mail'
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from '@/lib/tokens'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import bcrypt from 'bcryptjs'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { AuthError } from 'next-auth'
import { signIn } from 'next-auth/react'
import { z } from 'zod'

const app = new Hono()

  .get(
    '/user/by-email',
    zValidator(
      'query',
      z.object({
        email: z.string().email(),
      })
    ),
    async c => {
      const { email } = c.req.valid('query')

      const [data] = await db.select().from(users).where(eq(users.email, email))

      if (!data) {
        return c.json({ error: 'data not found' }, 404)
      }

      return c.json({ data })
    }
  )
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

      const [data] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          emailVerified: users.emailVerified,
          image: users.image,
          bio: users.bio,
          fullName: users.fullName,
          isTwoFactorEnabled: users.isTwoFactorEnabled,
        })
        .from(users)
        .where(eq(users.id, id))

      if (!data) {
        return c.json({ error: 'data not found' }, 404)
      }

      return c.json({ data })
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
        role: UserRole.USER,
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
        code: z.string().optional(),
      })
    ),
    async c => {
      const { email, code } = c.req.valid('json')

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))

      if (!existingUser || !existingUser.password || !existingUser.email) {
        return c.json({ error: 'Email is not exist!' }, 401)
      }

      const [existingAccount] = await db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, existingUser.id))

      const handleSuccess = (
        message: string,
        twoFactor: boolean = false,
        canLogin: boolean = false
      ) => {
        return c.json({
          data: { success: message, twoFactor, canLogin },
        })
      }

      // is provider account, dont need to verify
      if (!existingUser.emailVerified && existingAccount) {
        await db
          .update(users)
          .set({
            emailVerified: new Date(),
          })
          .where(eq(users.id, existingUser.id))

        return handleSuccess('Is provider account, login successfully')
      }

      if (!existingUser.emailVerified && !existingAccount) {
        const verificationToken = await generateVerificationToken(
          existingUser.email
        )

        if (!verificationToken) {
          return c.json(
            { error: 'Error when generate verification token!' },
            401
          )
        }

        await sendVerificationEmail(
          verificationToken.email,
          verificationToken.token
        )

        return handleSuccess('Confirmation email sent!')
      }

      if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          )

          if (!twoFactorToken) {
            return c.json({ error: 'Invalid code!' }, 401)
          }

          if (twoFactorToken.token !== code) {
            return c.json({ error: 'Invalid code!' }, 401)
          }

          const hasExpired = new Date(twoFactorToken.expires) < new Date()

          if (hasExpired) {
            return c.json({ error: 'Code expired!' }, 401)
          }

          await db
            .delete(twoFactorTokens)
            .where(
              and(
                eq(twoFactorTokens.email, twoFactorToken.email),
                eq(twoFactorTokens.token, twoFactorToken.token)
              )
            )

          const [existingConfirmation] = await db
            .select()
            .from(twoFactorConfirmations)
            .where(eq(twoFactorConfirmations.userId, existingUser.id))

          if (existingConfirmation) {
            await db
              .delete(twoFactorConfirmations)
              .where(eq(twoFactorConfirmations.id, existingConfirmation.id))
          }

          await db.insert(twoFactorConfirmations).values({
            userId: existingUser.id,
          })
        } else {
          const twoFactorToken = await generateTwoFactorToken(
            existingUser.email
          )

          if (!twoFactorToken) {
            return c.json(
              { error: 'Error when generate two factor token!' },
              401
            )
          }

          await sendTwoFactorEmail(existingUser.email, twoFactorToken)

          return handleSuccess('Two-factor email sent!', true)
        }
      }

      return handleSuccess('Login successful!', false, true)
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
  .post(
    '/change-password',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        password: z.string(),
        newPassword: z.string(),
      })
    ),
    async c => {
      try {
        const auth = c.get('authUser')
        if (!auth.token?.id) {
          return c.json({ error: 'Unauthorized' }, 401)
        }

        const { password, newPassword } = c.req.valid('json')

        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, auth.token?.id))

        if (!existingUser) {
          return c.json({ error: 'User does not exist!' }, 400)
        }

        if (!existingUser.password) {
          return c.json({ error: 'User does not have password!' }, 400)
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password
        )
        if (!isPasswordValid) {
          return c.json({ error: 'Current password is incorrect!' }, 400)
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12)

        await db
          .update(users)
          .set({ password: hashedNewPassword })
          .where(eq(users.id, existingUser.id))

        return c.json({ message: 'Password changed successfully!' }, 200)
      } catch (error) {
        console.error('Error changing password:', error)
        return c.json({ error: 'An unexpected error occurred' }, 500)
      }
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
        name: z.string().optional(),
        image: z.string().optional(),
        fullName: z.string().optional(),
        bio: z.string().optional(),
        isTwoFactorEnabled: z.boolean().optional(),
        emailVerified: z.string().optional(),
      })
    ),
    async c => {
      const { name, image, bio, fullName, isTwoFactorEnabled, emailVerified } =
        c.req.valid('json')
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

      const data = await db
        .update(users)
        .set({
          name,
          image,
          bio,
          fullName,
          isTwoFactorEnabled,
          emailVerified: emailVerified
            ? new Date(emailVerified)
            : existingUser.emailVerified,
        })
        .where(eq(users.id, id))

      if (!data) {
        return c.json({ error: 'Error when update user' }, 404)
      }

      return c.json({ data })
    }
  )

export default app
