import { db } from '@/db/drizzle'
import { chapters, lessons, purchases } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import {
  and,
  asc,
  desc,
  eq,
  exists,
  gt,
  inArray,
  lt,
  or,
  sql,
} from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get(
    '/:id',
    verifyAuth(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      'query',
      z.object({
        courseId: z.string(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')
      const { courseId } = c.req.valid('query')

      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [currentPurchase] = await db
        .select({ id: purchases.id })
        .from(purchases)
        .where(
          and(
            eq(purchases.userId, auth.token.id),
            eq(purchases.courseId, courseId)
          )
        )

      const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id))

      if (lesson.isFree || !!currentPurchase) {
        const [currentChapter] = await db
          .select()
          .from(chapters)
          .where(eq(chapters.id, lesson.chapterId))

        if (!currentChapter) return c.json({ error: 'Chapter not found' })

        const [nextChapter] = await db
          .select()
          .from(chapters)
          .where(
            and(
              eq(chapters.courseId, courseId),
              gt(chapters.position, currentChapter.position)
            )
          )
          .orderBy(asc(chapters.position))
          .limit(1)

        const [nextLesson] = await db
          .select()
          .from(lessons)
          .where(
            and(
              eq(lessons.courseId, courseId),
              eq(lessons.isPublished, true),
              !currentPurchase ? eq(lessons.isFree, true) : undefined,
              or(
                and(
                  eq(lessons.chapterId, lesson.chapterId),
                  gt(lessons.position, lesson.position)
                ),
                and(
                  nextChapter
                    ? eq(lessons.chapterId, nextChapter.id)
                    : undefined
                )
              )
            )
          )
          .orderBy(asc(lessons.position))
          .limit(1)

        const [prevChapter] = await db
          .select()
          .from(chapters)
          .where(
            and(
              eq(chapters.courseId, courseId),
              lt(chapters.position, currentChapter.position)
            )
          )
          .orderBy(desc(chapters.position))
          .limit(1)

        // Get previous lesson
        const [prevLesson] = await db
          .select()
          .from(lessons)
          .where(
            and(
              eq(lessons.courseId, courseId),
              eq(lessons.isPublished, true),
              !currentPurchase ? eq(lessons.isFree, true) : undefined,
              or(
                // Same chapter, lower position
                and(
                  eq(lessons.chapterId, lesson.chapterId),
                  lt(lessons.position, lesson.position)
                ),
                // Previous chapter's last lesson (only if we're at first lesson)
                and(
                  prevChapter
                    ? eq(lessons.chapterId, prevChapter.id)
                    : undefined
                )
              )
            )
          )
          .orderBy(desc(lessons.position))
          .limit(1)

        return c.json({
          data: {
            ...lesson,
            nextLesson: nextLesson ?? null,
            prevLesson: prevLesson ?? null,
          },
        })
      }

      return c.json({
        data: {
          ...lesson,
          nextLesson: null,
          prevLesson: null,
        },
      })
    }
  )
  .get(
    '/:courseId/first-lesson',
    verifyAuth(),
    zValidator(
      'param',
      z.object({
        courseId: z.string(),
      })
    ),
    async c => {
      const auth = c.get('authUser')
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { courseId } = c.req.valid('param')

      if (!courseId) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [currentPurchase] = await db
        .select({ id: purchases.id })
        .from(purchases)
        .where(
          and(
            eq(purchases.userId, auth.token.id),
            eq(purchases.courseId, courseId)
          )
        )

      const [firstLesson] = await db
        .select({ id: lessons.id })
        .from(lessons)
        .where(
          and(
            eq(lessons.courseId, courseId),
            eq(lessons.isPublished, true),
            !currentPurchase ? eq(lessons.isFree, true) : undefined
          )
        )
        .orderBy(asc(lessons.position))
        .limit(1)

      return c.json({
        data: firstLesson,
      })
    }
  )

export default app
