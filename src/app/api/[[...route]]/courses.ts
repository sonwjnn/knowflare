import { db } from '@/db/drizzle'
import {
  getCourses,
  getFiveTopCoursesLastThreeWeek,
  getTenLatestCourses,
} from '@/db/queries'
import { categories, chapters, courses, purchases, users } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { count, desc, eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get(
    '/',
    verifyAuth(),
    zValidator(
      'query',
      z.object({
        categoryId: z.string().optional(),
        title: z.string().optional(),
        level: z.string().optional(),
        pageNumber: z.string().optional(),
        rating: z.string().optional(),
      })
    ),
    async c => {
      const { title, categoryId, level, rating, pageNumber } =
        c.req.valid('query')

      const auth = c.get('authUser')

      const { data, pageCount } = await getCourses({
        title,
        categoryId,
        level,
        pageNumber: +(pageNumber || 1),
        rating: rating ? +rating : undefined,
        userId: auth.token?.id,
      })

      return c.json({
        data,
        pageCount,
      })
    }
  )
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
        .select({
          id: courses.id,
          price: courses.price,
          title: courses.title,
          description: courses.description,
          date: courses.date,
          imageUrl: courses.imageUrl,
          isPublished: courses.isPublished,
          categoryId: courses.categoryId,
          level: courses.level,
          avgRating: courses.avgRating,
          user: {
            id: users.id,
            name: users.name,
          },
        })
        .from(courses)
        .innerJoin(users, eq(users.id, courses.userId))
        .where(eq(courses.id, id))

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

      const chaptersData = await db
        .select()
        .from(chapters)
        .where(eq(chapters.courseId, data.id))

      return c.json({
        data: {
          ...data,
          chapters: chaptersData,
        },
      })
    }
  )
  .get('/list/top-courses-last-three-week', async c => {
    const today = new Date()
    const lastWeek = new Date(today)
    lastWeek.setDate(today.getDate() - 7)

    const { data } = await getFiveTopCoursesLastThreeWeek()

    return c.json({ data: data ?? [] })
  })
  .get('/list/latest-courses', async c => {
    const { data } = await getTenLatestCourses()

    return c.json({ data: data ?? [] })
  })

export default app
