import { db } from '@/db/drizzle'
import { getProgress } from '@/db/queries'
import { courses, purchases, users } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
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
        author: {
          id: users.id,
          name: users.name,
        },
        currentUserId: purchases.userId,
      })
      .from(purchases)
      .innerJoin(courses, eq(courses.id, purchases.courseId))
      .innerJoin(users, eq(users.id, courses.userId))
      .where(eq(purchases.userId, auth.token.id))

    const coursesWithProgress = await Promise.all(
      data.map(async course => {
        const data = await getProgress(course.currentUserId, course.courseId)

        return {
          ...course,
          progress: data,
        }
      })
    )

    return c.json({ data: coursesWithProgress })
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

      return c.json({ data: data ?? null })
    }
  )

export default app
