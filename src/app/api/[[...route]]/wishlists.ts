import { db } from '@/db/drizzle'
import { carts, courses, insertWishlistsSchema, wishlists } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, desc, eq } from 'drizzle-orm'
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
        courseId: courses.id,
        title: courses.title,
        description: courses.description,
        imageUrl: courses.imageUrl,
        price: courses.price,
        date: courses.date,
      })
      .from(wishlists)
      .innerJoin(courses, eq(courses.id, wishlists.courseId))
      .where(eq(wishlists.userId, auth.token.id))
      .orderBy(desc(wishlists.date))

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
        .from(wishlists)
        .where(
          and(eq(wishlists.courseId, id), eq(wishlists.userId, auth.token.id))
        )
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
        .from(wishlists)
        .where(
          and(
            eq(wishlists.courseId, courseId),
            eq(wishlists.userId, auth.token.id)
          )
        )

      return c.json({ data: data || null })
    }
  )
  .post(
    '/',
    verifyAuth(),
    zValidator(
      'json',
      insertWishlistsSchema.pick({
        courseId: true,
      })
    ),
    async c => {
      const auth = c.get('authUser')
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const values = c.req.valid('json')

      const [data] = await db.insert(wishlists).values({
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
  .post('/add-all-to-cart', verifyAuth(), async c => {
    const auth = c.get('authUser')
    if (!auth.token?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const existingWishlists = await db
      .select()
      .from(wishlists)
      .where(eq(wishlists.userId, auth.token.id))

    if (!existingWishlists) {
      return c.json({ error: 'No wishlists found' }, 404)
    }

    await db.delete(wishlists).where(eq(wishlists.userId, auth.token.id))

    for (const wishlist of existingWishlists) {
      await db.insert(carts).values({
        userId: auth.token.id,
        courseId: wishlist.courseId,
        date: new Date(),
      })
    }

    return c.json(null, 200)
  })
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
        .delete(wishlists)
        .where(
          and(eq(wishlists.courseId, id), eq(wishlists.userId, auth.token?.id))
        )

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

      return c.json({ data })
    }
  )

export default app
