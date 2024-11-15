import { db } from '@/db/drizzle'
import {
  categories,
  courses,
  insertCategoriesSchema,
  purchases,
} from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { desc, eq, inArray, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get('/', async c => {
    const data = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.name))

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

      const [data] = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(eq(categories.id, id))

      if (!data) {
        return c.json({ error: 'data not found' }, 404)
      }

      return c.json({ data })
    }
  )

  .get('/list/top-categories-last-three-week', async c => {
    const today = new Date()
    const lastWeek = new Date(today)
    lastWeek.setDate(today.getDate() - 7 * 3)

    const topCategories = await db
      .select({
        categoryId: categories.id,
        categoryName: categories.name,
        purchasesCount: sql<number>`COUNT(*)`.as('purchases_count'),
      })
      .from(purchases)
      .innerJoin(courses, eq(courses.id, purchases.courseId))
      .innerJoin(categories, eq(categories.id, courses.categoryId))
      .where(sql`DATE(${purchases.date}) >= ${lastWeek}`)
      .groupBy(categories.id)
      .orderBy(sql`purchases_count DESC`)
      .limit(5)

    return c.json({ data: topCategories })
  })

export default app
