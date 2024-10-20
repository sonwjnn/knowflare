import { db } from '@/db/drizzle'
import { insertReviewsSchema, reviews, users } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get(
    '/',
    verifyAuth(),
    zValidator('query', z.object({ courseId: z.string() })),
    async c => {
      const auth = c.get('authUser')
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { courseId } = c.req.valid('query')

      const data = await db
        .select({
          courseId: reviews.courseId,
          content: reviews.content,
          rating: reviews.rating,
          date: reviews.date,
          user: {
            id: users.id,
            name: users.name,
          },
        })
        .from(reviews)
        .innerJoin(users, eq(users.id, reviews.userId))
        .where(
          and(eq(reviews.courseId, courseId), eq(reviews.userId, auth.token.id))
        )
        .orderBy(desc(reviews.date))

      return c.json({ data })
    }
  )
  .post(
    '/',
    verifyAuth(),
    zValidator(
      'json',
      insertReviewsSchema.pick({
        content: true,
        rating: true,
        courseId: true,
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const values = c.req.valid('json')

      const [existingComment] = await db
        .select()
        .from(reviews)
        .where(
          and(
            eq(reviews.courseId, values.courseId),
            eq(reviews.userId, auth.token.id)
          )
        )

      if (existingComment) {
        return c.json({ error: 'Comment exist!' }, 401)
      }

      const [data] = await db.insert(reviews).values({
        ...values,
        userId: auth.token.id,
      })

      if (!data) {
        return c.json({ error: 'Something went wrong' }, 400)
      }

      return c.json({
        data,
      })
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

      const [existingComment] = await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.userId, auth.token.id), eq(reviews.courseId, id)))

      if (!existingComment) {
        return c.json({ error: 'Comment not found!' }, 401)
      }

      const data = await db
        .delete(reviews)
        .where(eq(reviews.courseId, existingComment.courseId))

      return c.json({ data })
    }
  )

export default app
