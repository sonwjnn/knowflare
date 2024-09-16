import { db } from '@/db/drizzle'
import { chapters, courses, insertChaptersSchema, muxData } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, asc, desc, eq } from 'drizzle-orm'
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
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { courseId } = c.req.valid('query')

      if (!courseId) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const data = await db
        .select()
        .from(chapters)
        .where(eq(chapters.courseId, courseId))
        .orderBy(asc(chapters.position))

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
      insertChaptersSchema.pick({
        courseId: true,
        title: true,
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { title, courseId } = c.req.valid('json')

      const [lastChapter] = await db
        .select({
          position: chapters.position,
        })
        .from(chapters)
        .where(eq(chapters.courseId, courseId))
        .orderBy(desc(chapters.position))
        .limit(1)

      const newPosition = lastChapter ? lastChapter.position + 1 : 1

      const [data] = await db
        .insert(chapters)
        .values({
          courseId,
          title,
          position: newPosition,
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

      const data = []

      for (let item of list) {
        const [updatedChapter] = await db
          .update(chapters)
          .set({ position: item.position })
          .where(eq(chapters.id, item.id))
          .returning()

        data.push(updatedChapter)
      }

      const dataOrder = data.sort((a, b) => a.position - b.position)

      return c.json({ dataOrder })
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

      const [chapter] = await db
        .select()
        .from(chapters)
        .where(eq(chapters.id, id))

      if (!chapter) {
        return c.json({ error: 'Chapter not found' }, 404)
      }

      const [muxDateResponse] = await db
        .select()
        .from(muxData)
        .where(eq(muxData.chapterId, id))

      return c.json({
        data: {
          ...chapter,
          muxData: muxDateResponse,
        },
      })
    }
  )

export default app
