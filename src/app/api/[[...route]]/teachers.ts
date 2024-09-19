import { db } from '@/db/drizzle'
import { courses, teachers } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string() })),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')

      const [currentTeacher] = await db
        .select({ id: teachers.id })
        .from(teachers)
        .where(eq(teachers.id, id))

      if (!currentTeacher) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      return c.json({
        data: currentTeacher,
      })
    }
  )
  .get(
    '/:id/courses',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string() })),
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

      const data = await db
        .select()
        .from(courses)
        .where(eq(courses.teacherId, currentTeacher.id))
        .orderBy(desc(courses.date))

      return c.json({
        data,
      })
    }
  )
  .get(
    '/by-user/:userId',
    verifyAuth(),
    zValidator('param', z.object({ userId: z.string() })),
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
        return c.json({ error: 'Teacher not found' }, 404)
      }

      return c.json({
        data: currentTeacher,
      })
    }
  )

export default app
