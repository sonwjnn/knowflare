import { db } from '@/db/drizzle'
import {
  courses,
  insertLessonsSchema,
  lessons,
  purchases,
  userLessonProgress,
} from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, asc, desc, eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get(
    '/',
    verifyAuth(),
    zValidator(
      'query',
      z.object({
        courseId: z.string().optional(),
        chapterId: z.string().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { courseId, chapterId } = c.req.valid('query')

      if (!courseId || !chapterId) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const data = await db
        .select()
        .from(lessons)
        .where(
          and(eq(lessons.courseId, courseId), eq(lessons.chapterId, chapterId))
        )
        .orderBy(asc(lessons.position))

      return c.json({
        data,
      })
    }
  )
  .get(
    '/:id',
    verifyAuth(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [data] = await db.select().from(lessons).where(eq(lessons.id, id))

      return c.json({
        data,
      })
    }
  )
  .post(
    '/',
    verifyAuth(),
    zValidator(
      'json',
      insertLessonsSchema.pick({
        courseId: true,
        chapterId: true,
        title: true,
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { title, courseId, chapterId } = c.req.valid('json')

      const [lastLesson] = await db
        .select({
          position: lessons.position,
        })
        .from(lessons)
        .where(eq(lessons.courseId, courseId))
        .orderBy(desc(lessons.position))
        .limit(1)

      const newPosition = lastLesson ? lastLesson.position + 1 : 1

      const [data] = await db.insert(lessons).values({
        chapterId,
        courseId,
        title,
        position: newPosition,
      })

      if (!data) {
        return c.json({ error: 'Something went wrong' }, 400)
      }

      return c.json({
        data,
      })
    }
  )
  .patch(
    '/:id',
    verifyAuth(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      'json',
      z.object({
        title: z.string().optional(),
        description: z.string().optional().nullable(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')
      const values = c.req.valid('json')

      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [data] = await db
        .update(lessons)
        .set(values)
        .where(eq(lessons.id, id))

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

      return c.json({ data })
    }
  )
  .post(
    '/reorder',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        list: z.array(
          z.object({
            id: z.string(),
            position: z.number(),
          })
        ),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { list } = c.req.valid('json')

      const data = [] as (typeof lessons.$inferSelect)[]

      for (let item of list) {
        await db
          .update(lessons)
          .set({ position: item.position })
          .where(eq(lessons.id, item.id))

        const [updatedLesson] = await db
          .select()
          .from(lessons)
          .where(eq(lessons.id, item.id))

        data.push(updatedLesson)
      }

      const dataOrder = data.sort((a, b) => a.position - b.position)

      return c.json({ dataOrder })
    }
  )
  .delete(
    '/:id',
    verifyAuth(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      if (auth.token?.role !== 'admin') {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id))

      if (!lesson) {
        return c.json({ error: 'Not found' }, 404)
      }

      const [deletedLesson] = await db.delete(lessons).where(eq(lessons.id, id))

      return c.json({ data: deletedLesson })
    }
  )

export default app
