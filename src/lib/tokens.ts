import { db } from '@/db/drizzle'
import {
  getPasswordResetTokenByEmail,
  getTwoFactorTokenByEmail,
} from '@/db/queries'
import { getVerificationTokenByEmail } from '@/db/queries'
import {
  passwordResetTokens,
  twoFactorTokens,
  verificationTokens,
} from '@/db/schema'
import crypto from 'crypto'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getPasswordResetTokenByEmail(email)

    if (existingToken) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.token, existingToken.token))
    }

    const [data] = await db.insert(passwordResetTokens).values({
      email,
      token,
      expires,
    })

    if (!data) {
      return null
    }

    return { token, email }
  } catch {
    return null
  }
}

export const generateVerificationToken = async (email: string) => {
  try {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getVerificationTokenByEmail(email)

    if (existingToken) {
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.token, existingToken.token))
    }

    const [data] = await db.insert(verificationTokens).values({
      email,
      token,
      expires,
    })

    if (!data) {
      return null
    }

    return { email, token }
  } catch {
    return null
  }
}

export const generateTwoFactorToken = async (
  email: string
): Promise<string | null> => {
  try {
    const token = crypto.randomInt(100_000, 1_000_000).toString()
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000)

    const existingToken = await getTwoFactorTokenByEmail(email)

    if (existingToken) {
      await db.delete(twoFactorTokens).where(eq(twoFactorTokens.email, email))
    }

    const [twoFactorToken] = await db
      .insert(twoFactorTokens)
      .values({ email, token, expires })

    if (!twoFactorToken) {
      return null
    }

    return token
  } catch {
    return null
  }
}
