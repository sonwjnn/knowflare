import { db } from '@/db/drizzle'
import { attachments } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono().get(
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
      .from(attachments)
      .where(eq(attachments.courseId, courseId))
      .orderBy(desc(attachments.date))

    return c.json({
      data,
    })
  }
)

export default app
