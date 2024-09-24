import { and, count, eq, sql } from 'drizzle-orm'

import { db } from './drizzle'
import {
  chapters,
  passwordResetTokens,
  userProgress,
  verificationTokens,
} from './schema'

export const getProgress = async (
  userId: string | null,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db
      .select({ id: chapters.id })
      .from(chapters)
      .where(
        and(eq(chapters.courseId, courseId), eq(chapters.isPublished, true))
      )

    const publishedChapterIds = publishedChapters?.map(chapter => chapter.id)

    const [validCompletedChapters] = await db
      .select({
        count: count(userProgress.id),
      })
      .from(userProgress)
      .where(
        and(
          userId ? eq(userProgress.userId, userId) : undefined,
          eq(userProgress.isCompleted, true),
          sql`${userProgress.chapterId} = ANY(${publishedChapterIds})`
        )
      )

    const progressPercentage =
      (validCompletedChapters.count / publishedChapterIds.length) * 100 || 0
    return progressPercentage
  } catch (error) {
    console.log('GET_PROGRESS', error)
    return 0
  }
}

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const [data] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))

    return data
  } catch {
    return null
  }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const [data] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.email, email))

    return data
  } catch {
    return null
  }
}

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const [data] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token))

    return data
  } catch {
    return null
  }
}

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const [data] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.email, email))

    return data
  } catch {
    return null
  }
}
