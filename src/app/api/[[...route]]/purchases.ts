import { db } from '@/db/drizzle'
import { categories, courses, purchases } from '@/db/schema'
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
        id: purchases.id,
        courseId: courses.id,
        title: courses.title,
        description: courses.description,
        imageUrl: courses.imageUrl,
        price: courses.price,
        date: courses.date,
      })
      .from(purchases)
      .innerJoin(courses, eq(courses.id, purchases.courseId))
      .where(eq(purchases.userId, auth.token.id))

    return c.json({ data })
  })
  .get(
    '/:courseId',
    verifyAuth(),
    zValidator(
      'param',
      z.object({
        courseId: z.string(),
      })
    ),
    async c => {
      const auth = c.get('authUser')
      const { courseId } = c.req.param()

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const [data] = await db
        .select({
          id: purchases.id,
          courseId: courses.id,
          title: courses.title,
          description: courses.description,
          imageUrl: courses.imageUrl,
          price: courses.price,
          date: courses.date,
        })
        .from(purchases)
        .innerJoin(courses, eq(courses.id, purchases.courseId))
        .where(
          and(
            eq(purchases.userId, auth.token.id),
            eq(purchases.courseId, courseId)
          )
        )

      return c.json({ data })
    }
  )

export default app
