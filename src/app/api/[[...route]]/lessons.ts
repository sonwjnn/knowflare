import { db } from '@/db/drizzle'
import { lessons, purchases } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, asc, desc, eq, gt, lt, sql } from 'drizzle-orm'
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
        const [nextLesson] = await db
          .select()
          .from(lessons)
          .where(
            and(
              eq(lessons.courseId, courseId),
              eq(lessons.isPublished, true),
              !currentPurchase ? eq(lessons.isFree, true) : undefined,
              gt(lessons.position, lesson.position)
            )
          )
          .orderBy(asc(lessons.position))

        const [prevLesson] = await db
          .select()
          .from(lessons)
          .where(
            and(
              eq(lessons.courseId, courseId),
              eq(lessons.isPublished, true),
              !currentPurchase ? eq(lessons.isFree, true) : undefined,
              lt(lessons.position, lesson.position)
            )
          )
          .orderBy(desc(lessons.position))

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
