import { db } from '@/db/drizzle'
import { getProgress } from '@/db/queries'
import {
  categories,
  chapters,
  courses,
  purchases,
  userLessonProgress,
} from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get(
    '/by-course-id/:courseId',
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

      const data = await getProgress(auth.token?.id, courseId)

      return c.json({
        data,
      })
    }
  )
  .get(
    '/:lessonId',
    verifyAuth(),
    zValidator(
      'param',
      z.object({
        lessonId: z.string(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { lessonId } = c.req.valid('param')

      const [data] = await db
        .select()
        .from(userLessonProgress)
        .where(
          and(
            eq(userLessonProgress.lessonId, lessonId),
            eq(userLessonProgress.userId, auth.token.id)
          )
        )

      return c.json({
        data: data ?? null,
      })
    }
  )
  .post(
    '/upsert/:lessonId',
    verifyAuth(),
    zValidator(
      'param',
      z.object({
        lessonId: z.string(),
      })
    ),
    zValidator(
      'json',
      z.object({
        isCompleted: z.boolean(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { lessonId } = c.req.valid('param')
      const { isCompleted } = c.req.valid('json')

      let data

      if (!data) {
        const data = await db
          .insert(userLessonProgress)
          .values({
            userId: auth.token?.id,
            lessonId,
            isCompleted,
          })
          .onDuplicateKeyUpdate({ set: { isCompleted } })

        return c.json({
          data: data ?? null,
        })
      }

      return c.json({
        data,
      })
    }
  )

export default app
