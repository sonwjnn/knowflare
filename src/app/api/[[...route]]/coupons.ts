import { db } from '@/db/drizzle'
import {
  CouponType,
  categories,
  coupons,
  insertCouponsSchema,
} from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { Hono } from 'hono'
import { v4 as uuidv4 } from 'uuid'
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
        return c.json({ error: 'data not found' }, 404)
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
  .get(
    '/by-code/:code',
    zValidator(
      'param',
      z.object({
        code: z.string(),
      })
    ),
    async c => {
      const { code } = c.req.valid('param')

      const [data] = await db
        .select()
        .from(coupons)
        .where(eq(coupons.code, code))

      if (!data) {
        return c.json({ error: 'data not found' }, 404)
      }

      return c.json({ data })
    }
  )

export default app
