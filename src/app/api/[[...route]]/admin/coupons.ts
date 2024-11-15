import { db } from '@/db/drizzle'
import { categories, coupons, insertCouponsSchema } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { eq, inArray } from 'drizzle-orm'
import { Hono } from 'hono'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const app = new Hono()
  .get('/', async c => {
    const data = await db
      .select({
        id: coupons.id,
        code: coupons.code,
        discountAmount: coupons.discountAmount,
        expires: coupons.expires,
        category: {
          id: categories.id,
          name: categories.name,
        },
        isActive: coupons.isActive,
      })
      .from(coupons)
      .innerJoin(categories, eq(coupons.categoryId, categories.id))

    if (!data) {
      return c.json({ error: 'Not found' }, 404)
    }

    return c.json({
      data,
    })
  })
  .get(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      })
    ),
    async c => {
      const { id } = c.req.valid('param')

      const [data] = await db.select().from(coupons).where(eq(coupons.id, id))

      if (!data) {
        return c.json({ error: 'data not found' }, 404)
      }

      return c.json({ data })
    }
  )
  .post(
    '/',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        categoryId: z.string(),
        discountAmount: z.number(),
        expires: z.string(),
      })
    ),
    async c => {
      const auth = c.get('authUser')
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
      const values = c.req.valid('json')

      const [data] = await db.insert(coupons).values({
        ...values,
        expires: new Date(values.expires),
        isActive: true,
        code: uuidv4(),
      })

      if (!data) {
        return c.json({ error: 'Something went wrong' }, 400)
      }

      return c.json({ data })
    }
  )
  .patch(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      'json',
      z.object({
        categoryId: z.string().optional(),
        discountAmount: z.number().optional(),
        expires: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    ),
    async c => {
      const values = c.req.valid('json')
      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Id is required!' }, 400)
      }

      const [existingUser] = await db
        .select()
        .from(coupons)
        .where(eq(coupons.id, id))

      if (!existingUser) {
        return c.json({ error: 'User does not exist!' }, 400)
      }

      const [data] = await db
        .update(coupons)
        .set({
          ...values,
          expires: values.expires ? new Date(values.expires) : undefined,
        })
        .where(eq(coupons.id, id))

      if (!data) {
        return c.json({ error: 'Error when update user' }, 404)
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

      const [category] = await db
        .select()
        .from(coupons)
        .where(eq(coupons.id, id))

      if (!category) {
        return c.json({ error: 'Not found' }, 404)
      }

      const [deletedData] = await db.delete(coupons).where(eq(coupons.id, id))

      return c.json({ data: deletedData })
    }
  )
  .post(
    '/bulk-delete',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        ids: z.array(z.string()),
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

      const values = c.req.valid('json')

      if (!values) {
        return c.json({ error: 'Missing values' }, 400)
      }

      const data = await db
        .delete(coupons)
        .where(inArray(coupons.id, values.ids))

      return c.json({ data })
    }
  )

export default app
