import { db } from '@/db/drizzle'
import { attachments, courses, insertCoursesSchema, muxData } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get(
    '/',
    verifyAuth(),

    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const data = await db
        .select()
        .from(courses)
        .where(eq(courses.userId, auth.token.id))
        .orderBy(desc(courses.date))

      return c.json({
        data,
      })
    }
  )
  .get(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string() })),
    async c => {
      const auth = c.get('authUser')
      const { id } = c.req.valid('param')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const [data] = await db
        .select()
        .from(courses)
        .where(and(eq(courses.id, id), eq(courses.userId, auth.token.id)))

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

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
      insertCoursesSchema.pick({
        title: true,
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const values = c.req.valid('json')

      const [data] = await db
        .insert(courses)
        .values({
          ...values,
          date: new Date(),
          userId: auth.token.id,
        })
        .returning()

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
        categoryId: z.string().optional().nullable(),
        title: z.string().optional(),
        description: z.string().optional().nullable(),
        imageUrl: z.string().optional().nullable(),
        price: z.number().optional(),
        isPublished: z.boolean().optional(),
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
        .update(courses)
        .set(values)
        .where(and(eq(courses.userId, auth.token.id), eq(courses.id, id)))
        .returning()

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
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

      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [data] = await db
        .delete(courses)
        .where(and(eq(courses.userId, auth.token.id), eq(courses.id, id)))
        .returning({
          id: courses.id,
        })

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

      return c.json({ data })
    }
  )
  .get(
    '/:id/attachments',
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

      const [courseOwner] = await db
        .select({
          id: courses.id,
        })
        .from(courses)
        .where(and(eq(courses.userId, auth.token.id), eq(courses.id, id)))

      if (!courseOwner) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const data = await db
        .select()
        .from(attachments)
        .where(eq(attachments.courseId, courseOwner.id))
        .orderBy(desc(attachments.date))

      return c.json({
        data,
      })
    }
  )

export default app
