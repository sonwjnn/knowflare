import { and, asc, count, eq, sql } from 'drizzle-orm'

import { db } from './drizzle'
import {
  chapters,
  lessons,
  passwordResetTokens,
  userLessonProgress,
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

    const chaptersWithLessons = await Promise.all(
      publishedChapters.map(async chapter => {
        const lessonsData = await db
          .select()
          .from(lessons)
          .where(eq(lessons.chapterId, chapter.id))
          .groupBy(lessons.id)

        return {
          ...chapter,
          lessons: lessonsData,
        }
      })
    )

    const lessonIds = chaptersWithLessons.flatMap(chapter =>
      chapter.lessons.map(lesson => lesson.id)
    )

    const [validCompletedLessons] = await db
      .select({
        count: count(userLessonProgress.lessonId),
      })
      .from(userLessonProgress)
      .where(
        and(
          userId ? eq(userLessonProgress.userId, userId) : undefined,
          eq(userLessonProgress.isCompleted, true),
          sql`${userLessonProgress.lessonId} = ANY(${lessonIds})`
        )
      )

    const progressPercentage =
      (validCompletedLessons.count / lessonIds.length) * 100 || 0
    return progressPercentage
  } catch (error) {
    console.log('GET_PROGRESS', error)
    return 0
  }
}
export const getChapters = async (userId: string | null, courseId: string) => {
  const data = await db
    .select()
    .from(chapters)
    .where(eq(chapters.courseId, courseId))
    .orderBy(asc(chapters.position))

  const chaptersWithLessons = await Promise.all(
    data.map(async chapter => {
      const lessonsData = await db
        .select({
          id: lessons.id,
          chapterId: lessons.chapterId,
          title: lessons.title,
          description: lessons.description,
          lessonType: lessons.lessonType,
          position: lessons.position,
          isPublished: lessons.isPublished,
          isFree: lessons.isFree,
          videoUrl: lessons.videoUrl,
          duration: lessons.duration,
          question: lessons.question,
          questionType: lessons.questionType,
          isCompleted: sql`CASE WHEN ${userLessonProgress.lessonId} IS NOT NULL THEN true ELSE false END`,
        })
        .from(lessons)
        .leftJoin(
          userLessonProgress,
          and(
            eq(userLessonProgress.lessonId, lessons.id),
            userId ? eq(userLessonProgress.userId, userId) : undefined
          )
        )
        .where(eq(lessons.chapterId, chapter.id))
        .groupBy(lessons.id)
        .orderBy(asc(lessons.position))

      return {
        ...chapter,
        lessons: lessonsData,
      }
    })
  )
  return chaptersWithLessons
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
