import { db } from '@/db/drizzle'
import { chapters, courses, insertChaptersSchema } from '@/db/schema'
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
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { courseId } = c.req.valid('query')

      if (!courseId) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const data = await db
        .select()
        .from(chapters)
        .where(eq(chapters.courseId, courseId))
        .orderBy(asc(chapters.position))

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
      insertChaptersSchema.pick({
        courseId: true,
        title: true,
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { title, courseId } = c.req.valid('json')

      const [lastChapter] = await db
        .select({
          position: chapters.position,
        })
        .from(chapters)
        .where(eq(chapters.courseId, courseId))
        .orderBy(desc(chapters.position))
        .limit(1)

      const newPosition = lastChapter ? lastChapter.position + 1 : 1

      const data = await db.insert(chapters).values({
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

      const data = [] as (typeof chapters.$inferSelect)[]

      for (let item of list) {
        await db
          .update(chapters)
          .set({ position: item.position })
          .where(eq(chapters.id, item.id))

        const [updatedChapter] = await db
          .select()
          .from(chapters)
          .where(eq(chapters.id, item.id))

        data.push(updatedChapter)
      }

      const dataOrder = data.sort((a, b) => a.position - b.position)

      return c.json({ dataOrder })
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

      const [data] = await db.select().from(chapters).where(eq(chapters.id, id))

      if (!data) {
        return c.json({ error: 'Chapter not found' }, 404)
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

      const data = await db
        .update(chapters)
        .set(values)
        .where(eq(chapters.id, id))

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

      return c.json({ data })
    }
  )

  .patch(
    '/:id/publish',
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
        courseId: z.string().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')
      const { courseId } = c.req.valid('query')

      if (!id || !courseId) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [course] = await db
        .select()
        .from(courses)
        .where(and(eq(courses.id, courseId)))

      if (!course) {
        return c.json({ error: 'Not found' }, 404)
      }

      const [chapter] = await db
        .select()
        .from(chapters)
        .where(and(eq(chapters.courseId, course.id), eq(chapters.id, id)))

      if (!chapter || !chapter.title || !chapter.description) {
        return c.json({ error: 'Missing required fields!' }, 400)
      }

      const data = await db
        .update(chapters)
        .set({ isPublished: true })
        .where(eq(chapters.id, id))

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

      return c.json({ data })
    }
  )
  .patch(
    '/:id/unpublish',
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
        courseId: z.string().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')

      const { courseId } = c.req.valid('query')

      if (!id || !courseId) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [course] = await db
        .select()
        .from(courses)
        .where(and(eq(courses.id, courseId)))

      if (!course) {
        return c.json({ error: 'Not found' }, 404)
      }

      const data = await db
        .update(chapters)
        .set({ isPublished: false })
        .where(eq(chapters.id, id))

      if (!data) {
        return c.json({ error: 'Error when update chapter' }, 404)
      }

      const publishedChaptersInCourse = await db
        .select()
        .from(chapters)
        .where(
          and(eq(chapters.courseId, course.id), eq(chapters.isPublished, true))
        )

      if (!publishedChaptersInCourse.length) {
        await db
          .update(courses)
          .set({ isPublished: false })
          .where(eq(courses.id, course.id))
      }

      return c.json({ data })
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

      const [chapter] = await db
        .select()
        .from(chapters)
        .where(eq(chapters.id, id))

      if (!chapter) {
        return c.json({ error: 'Not found' }, 404)
      }

      const data = await db.delete(chapters).where(eq(chapters.id, id))

      if (!data) {
        return c.json({ error: 'Error when delete chapter' }, 404)
      }

      return c.json({ data })
    }
  )

export default app
