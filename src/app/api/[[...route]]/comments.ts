import { db } from '@/db/drizzle'
import { carts, courses, insertCartsSchema } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, desc, eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get('/', verifyAuth(), async c => {
    const auth = c.get('authUser')
    if (!auth.token?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const data = await db
      .select({
        id: carts.id,
        courseId: courses.id,
        title: courses.title,
        description: courses.description,
        imageUrl: courses.imageUrl,
        price: courses.price,
        date: courses.date,
      })
      .from(carts)
      .innerJoin(courses, eq(courses.id, carts.courseId))
      .where(eq(carts.userId, auth.token.id))
      .orderBy(desc(carts.date))

    return c.json({ data })
  })
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
        .from(carts)
        .where(and(eq(carts.id, id), eq(carts.userId, auth.token.id)))
      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

      return c.json({ data })
    }
  )
  .get(
    '/by-course-id/:courseId',
    verifyAuth(),
    zValidator('param', z.object({ courseId: z.string() })),
    async c => {
      const auth = c.get('authUser')
      const { courseId } = c.req.valid('param')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const [data] = await db
        .select()
        .from(carts)
        .where(
          and(eq(carts.courseId, courseId), eq(carts.userId, auth.token.id))
        )

      return c.json({ data: data || null })
    }
  )
  .post(
    '/',
    verifyAuth(),
    zValidator(
      'json',
      insertCartsSchema.pick({
        courseId: true,
      })
    ),
    async c => {
      const auth = c.get('authUser')
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const values = c.req.valid('json')

      const [data] = await db.insert(carts).values({
        ...values,
        userId: auth.token.id,
        date: new Date(),
      })

      if (!data) {
        return c.json({ error: 'Something went wrong' }, 400)
      }

      return c.json({ data })
    }
  )
  // .patch(
  //   '/:id',
  //   verifyAuth(),
  //   zValidator('param', z.object({ id: z.string() })),
  //   zValidator(
  //     'json',
  //     insertCartsSchema.pick({
  //       courseId: true,
  //       quantity: true,
  //     })
  //   ),
  //   async c => {
  //     const auth = c.get('authUser')
  //     if (!auth.token?.id) {
  //       return c.json({ error: 'Unauthorized' }, 401)
  //     }

  //     const { id } = c.req.valid('param')
  //     const { courseId } = c.req.valid('json')

  //     const [data] = await db
  //       .update(carts)
  //       .set()
  //       .where(
  //         and(
  //           eq(carts.id, id),
  //           eq(carts.courseId, courseId),
  //           eq(carts.userId, auth.token.id)
  //         )
  //       )

  //     if (!data) {
  //       return c.json({ error: 'Not found' }, 404)
  //     }

  //     return c.json({ data })
  //   }
  // )
  .delete(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string() })),
    async c => {
      const auth = c.get('authUser')
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')
      const [data] = await db
        .delete(carts)
        .where(and(eq(carts.id, id), eq(carts.userId, auth.token?.id)))

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

      return c.json({ data })
    }
  )

export default app
