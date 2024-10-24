import { db } from '@/db/drizzle'
import { getProgress } from '@/db/queries'
import {
  CourseLevel,
  carts,
  categories,
  chapters,
  courses,
  insertCoursesSchema,
  purchases,
  subCategories,
  users,
} from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, desc, eq, like } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        categoryId: z.string().optional(),
        title: z.string().optional(),
        level: z.string().optional(),
      })
    ),
    async c => {
      const { title, categoryId, level } = c.req.valid('query')

      console.log(level, categoryId, title)

      const data = await db
        .select({
          id: courses.id,
          title: courses.title,
          description: courses.description,
          imageUrl: courses.imageUrl,
          price: courses.price,
          level: courses.level,
          isPublished: courses.isPublished,
          date: courses.date,
          category: {
            id: subCategories.id,
            name: subCategories.name,
          },
        })
        .from(courses)
        .innerJoin(subCategories, eq(subCategories.id, courses.subCategoryId))
        .where(
          and(
            eq(courses.isPublished, true),
            title ? like(courses.title, `%${title}%`) : undefined,
            categoryId ? eq(courses.subCategoryId, categoryId) : undefined,
            level ? eq(courses.level, level as CourseLevel) : undefined
          )
        )
        .orderBy(desc(courses.date))

      // const coursesWithChapters = await Promise.all(
      //   data.map(async course => {
      //     const courseChapters = await db
      //       .select({
      //         id: chapters.id,
      //       })
      //       .from(chapters)
      //       .where(
      //         and(
      //           eq(chapters.courseId, course.id),
      //           eq(chapters.isPublished, true)
      //         )
      //       )

      //     return {
      //       ...course,
      //       chapters: courseChapters,
      //     }
      //   })
      // )

      // const progresses: { courseId: string; progress: number }[] = []

      // for (let course of coursesWithChapters) {
      //   const progress = await getProgress(auth.token?.id, course.id)
      //   progresses.push({
      //     courseId: course.id,
      //     progress,
      //   })
      // }

      // const finalCoursesData = coursesWithChapters.map(course => {
      //   // if (!course?.purchase) {
      //   //   return {
      //   //     ...course,
      //   //     progress: 0,
      //   //   }
      //   // }

      //   const foundProgress = progresses.find(
      //     progress => progress.courseId === course.id
      //   )
      //   return {
      //     ...course,
      //     progress: foundProgress ? foundProgress.progress : 0,
      //   }
      // })

      return c.json({
        data,
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

  .post(
    '/',
    verifyAuth(),
    zValidator(
      'json',
      insertCoursesSchema.pick({
        title: true,
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const [currentTeacher] = await db
        .select({ id: teachers.id })
        .from(teachers)
        .where(eq(teachers.userId, auth.token.id))

      if (!currentTeacher) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const values = c.req.valid('json')

      const [data] = await db
        .insert(courses)
        .values({
          ...values,
          date: new Date(),
          teacherId: currentTeacher.id,
        })
        .returning()

      if (!data) {
        return c.json({ error: 'Something went wrong' }, 400)
      }

      return c.json({
        data,
      })
    }
  )
  .patch(
    '/:id',
    verifyAuth(),
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      'json',
      z.object({
        categoryId: z.string().optional().nullable(),
        title: z.string().optional(),
        description: z.string().optional().nullable(),
        imageUrl: z.string().optional().nullable(),
        price: z.number().optional(),
        isPublished: z.boolean().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const [currentTeacher] = await db
        .select({ id: teachers.id })
        .from(teachers)
        .where(eq(teachers.userId, auth.token.id))

      if (!currentTeacher) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')
      const values = c.req.valid('json')

      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [data] = await db
        .update(courses)
        .set(values)
        .where(
          and(eq(courses.teacherId, currentTeacher.id), eq(courses.id, id))
        )
        .returning()

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
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

      const [currentTeacher] = await db
        .select({ id: teachers.id })
        .from(teachers)
        .where(eq(teachers.userId, auth.token.id))

      if (!currentTeacher) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [data] = await db
        .delete(courses)
        .where(
          and(eq(courses.teacherId, currentTeacher.id), eq(courses.id, id))
        )
        .returning({
          id: courses.id,
        })

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

      return c.json({ data })
    }
  )
  .patch(
    '/:id/publish',
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

      const [currentTeacher] = await db
        .select({ id: teachers.id })
        .from(teachers)
        .where(eq(teachers.userId, auth.token.id))

      if (!currentTeacher) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [course] = await db
        .select()
        .from(courses)
        .where(
          and(eq(courses.teacherId, currentTeacher.id), eq(courses.id, id))
        )

      if (!course) {
        return c.json({ error: 'Not found' }, 404)
      }

      const courseChapters = await db
        .select()
        .from(chapters)
        .where(eq(chapters.courseId, course.id))

      const hasPublishedChapter = courseChapters.some(
        chapter => chapter.isPublished
      )

      if (
        !course.title ||
        !course.description ||
        !course.imageUrl ||
        !course.categoryId ||
        !hasPublishedChapter
      ) {
        return c.json({ error: 'Missing required fields!' }, 400)
      }

      const [data] = await db
        .update(courses)
        .set({ isPublished: true })
        .where(
          and(eq(courses.teacherId, currentTeacher.id), eq(courses.id, id))
        )
        .returning()

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

      return c.json({ data })
    }
  )

  .patch(
    '/:id/unpublish',
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

      const [currentTeacher] = await db
        .select({ id: teachers.id })
        .from(teachers)
        .where(eq(teachers.userId, auth.token.id))

      if (!currentTeacher) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [course] = await db
        .select()
        .from(courses)
        .where(
          and(eq(courses.teacherId, currentTeacher.id), eq(courses.id, id))
        )

      if (!course) {
        return c.json({ error: 'Not found' }, 404)
      }

      const [data] = await db
        .update(courses)
        .set({ isPublished: false })
        .where(
          and(eq(courses.teacherId, currentTeacher.id), eq(courses.id, id))
        )
        .returning()

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

      return c.json({ data })
    }
  )
  .put(
    '/:courseId/chapters/:chapterId/progress',
    verifyAuth(),
    zValidator(
      'param',
      z.object({
        courseId: z.string(),
        chapterId: z.string(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { courseId, chapterId } = c.req.valid('param')

      const [existingCourse] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))

      if (!existingCourse) {
        return c.json({ error: 'Not found' }, 404)
      }

      return c.json(null, 200)
    }
  )

export default app
