import { db } from '@/db/drizzle'
import { CouponType, categories, coupons } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
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
        return c.json({ error: 'data not found' }, 401)
      }

      return c.json({ data })
    }
  )
  .get(
    '/by-cate/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      })
    ),
    async c => {
      const { id } = c.req.valid('param')

      const [data] = await db
        .select()
        .from(coupons)
        .where(
          and(eq(coupons.categoryId, id), eq(coupons.type, CouponType.PUBLIC))
        )
        .orderBy(desc(coupons.discountAmount))

      if (!data) {
        return c.json({ error: 'data not found' }, 404)
      }

      return c.json({ data })
    }
  )
  .post(
    '/by-code',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        code: z.string(),
        categoryId: z.string(),
      })
    ),
    async c => {
      const auth = c.get('authUser')
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { code, categoryId } = c.req.valid('json')

      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId))

      if (!existingCategory) {
        return c.json({ error: 'category not found' }, 401)
      }

      const [data] = await db
        .select()
        .from(coupons)
        .where(and(eq(coupons.code, code), eq(coupons.categoryId, categoryId)))

      console.log(data.id)

      if (!data) {
        return c.json({ error: 'data not found' }, 401)
      }

      return c.json({ data })
    }
  )

export default app
