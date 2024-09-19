import { and, count, eq, sql } from 'drizzle-orm'

import { db } from './drizzle'
import { chapters, userProgress } from './schema'

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
