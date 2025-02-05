import { db } from '@/db/drizzle'
import { carts, coupons, courses } from '@/db/schema'
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
        courseId: courses.id,
        title: courses.title,
        description: courses.description,
        imageUrl: courses.imageUrl,
        price: courses.price,
        date: courses.date,
        couponId: coupons.id,
        discountAmount: coupons.discountAmount,
        discountPrice: sql<number>`(course.price - 
      (course.price * coupon.discount_amount / 100)
    )`,
      })
      .from(carts)
      .innerJoin(courses, eq(courses.id, carts.courseId))
      .leftJoin(coupons, eq(coupons.id, carts.couponId))
      .where(eq(carts.userId, auth.token.id))
      .orderBy(desc(carts.date))

    return c.json({ data: data ?? [] })
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
        .where(and(eq(carts.courseId, id), eq(carts.userId, auth.token.id)))
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
      z.object({ courseId: z.string(), couponId: z.string().optional() })
    ),
    async c => {
      const auth = c.get('authUser')
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
      const values = c.req.valid('json')

      const [existingCart] = await db
        .select()
        .from(carts)
        .where(
          and(
            eq(carts.userId, auth.token?.id),
            eq(carts.courseId, values.courseId)
          )
        )

      if (existingCart) {
        return c.json({ error: 'This course already exist in your cart!' }, 401)
      }

      const data = await db.insert(carts).values({
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
      const data = await db
        .delete(carts)
        .where(and(eq(carts.courseId, id), eq(carts.userId, auth.token?.id)))

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

      return c.json({ data })
    }
  )

export default app
