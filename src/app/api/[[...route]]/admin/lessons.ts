import { db } from '@/db/drizzle'
import {
  LessonType,
  chapters,
  courses,
  insertLessonsSchema,
  lessons,
  purchases,
  userLessonProgress,
} from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, asc, desc, eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get(
    '/',
    verifyAuth(),
    zValidator(
      'query',
      z.object({
        courseId: z.string().optional(),
        chapterId: z.string().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { courseId, chapterId } = c.req.valid('query')

      if (!courseId || !chapterId) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const data = await db
        .select()
        .from(lessons)
        .where(
          and(eq(lessons.courseId, courseId), eq(lessons.chapterId, chapterId))
        )
        .orderBy(asc(lessons.position))

      return c.json({
        data,
      })
    }
  )
  .get(
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

      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [data] = await db.select().from(lessons).where(eq(lessons.id, id))

      return c.json({
        data,
      })
    }
  )
  .post(
    '/',
    verifyAuth(),
    zValidator(
      'json',
      insertLessonsSchema.pick({
        courseId: true,
        chapterId: true,
        title: true,
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { title, courseId, chapterId } = c.req.valid('json')

      const [lastLesson] = await db
        .select({
          position: lessons.position,
        })
        .from(lessons)
        .where(eq(lessons.courseId, courseId))
        .orderBy(desc(lessons.position))
        .limit(1)

      const newPosition = lastLesson ? lastLesson.position + 1 : 1

      const data = await db.insert(lessons).values({
        chapterId,
        courseId,
        title,
        position: newPosition,
        lessonType: LessonType.VIDEO,
      })

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
        title: z.string().optional(),
        description: z.string().optional().nullable(),
        lessonType: z.string().optional(),
        videoUrl: z.string().optional(),
        isFree: z.boolean().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')
      const values = c.req.valid('json')

      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const data = await db
        .update(lessons)
        .set({
          ...values,
          lessonType: values.lessonType
            ? (values.lessonType as LessonType)
            : undefined,
        })
        .where(eq(lessons.id, id))

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
    zValidator(
      'query',
      z.object({
        chapterId: z.string().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')
      const { chapterId } = c.req.valid('query')

      if (!id || !chapterId) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [chapter] = await db
        .select()
        .from(chapters)
        .where(and(eq(chapters.id, chapterId)))

      if (!chapter) {
        return c.json({ error: 'Not found' }, 404)
      }

      const [lesson] = await db
        .select()
        .from(lessons)
        .where(and(eq(lessons.chapterId, chapter.id), eq(lessons.id, id)))

      if (!lesson || !lesson.title || !lesson.description || !lesson.videoUrl) {
        return c.json({ error: 'Missing required fields!' }, 400)
      }

      const data = await db
        .update(lessons)
        .set({ isPublished: true })
        .where(eq(lessons.id, id))

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
    zValidator(
      'query',
      z.object({
        chapterId: z.string().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')

      const { chapterId } = c.req.valid('query')

      if (!id || !chapterId) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [chapter] = await db
        .select()
        .from(chapters)
        .where(and(eq(chapters.id, chapterId)))

      if (!chapter) {
        return c.json({ error: 'Not found' }, 404)
      }

      const data = await db
        .update(lessons)
        .set({ isPublished: false })
        .where(eq(lessons.id, id))

      const publishedLessonsInChapter = await db
        .select()
        .from(lessons)
        .where(
          and(eq(lessons.chapterId, chapter.id), eq(lessons.isPublished, true))
        )

      if (!publishedLessonsInChapter.length) {
        await db
          .update(chapters)
          .set({ isPublished: false })
          .where(eq(chapters.id, chapter.id))
      }

      return c.json({ data })
    }
  )
  .post(
    '/reorder',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        list: z.array(
          z.object({
            id: z.string(),
            position: z.number(),
          })
        ),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { list } = c.req.valid('json')

      const data = [] as (typeof lessons.$inferSelect)[]

      for (let item of list) {
        await db
          .update(lessons)
          .set({ position: item.position })
          .where(eq(lessons.id, item.id))

        const [updatedLesson] = await db
          .select()
          .from(lessons)
          .where(eq(lessons.id, item.id))

        data.push(updatedLesson)
      }

      const dataOrder = data.sort((a, b) => a.position - b.position)

      return c.json({ dataOrder })
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

      const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id))

      if (!lesson) {
        return c.json({ error: 'Not found' }, 404)
      }

      const data = await db.delete(lessons).where(eq(lessons.id, id))

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
      }

      return c.json({ data })
    }
  )

export default app
