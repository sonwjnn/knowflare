import { db } from '@/db/drizzle'
import { getPasswordResetTokenByEmail } from '@/db/queries'
import { getVerificationTokenByEmail } from '@/db/queries'
import { passwordResetTokens, verificationTokens } from '@/db/schema'
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
