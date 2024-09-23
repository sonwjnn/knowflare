import { db } from '@/db/drizzle'
import { getProgress } from '@/db/queries'
import {
  categories,
  chapters,
  courses,
  purchases,
  userProgress,
} from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono().get(
  '/:userId/:courseId',
  verifyAuth(),
  zValidator(
    'param',
    z.object({
      userId: z.string(),
      courseId: z.string(),
    })
  ),
  async c => {
    const auth = c.get('authUser')

    if (!auth.token?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { userId, courseId } = c.req.valid('param')

    const data = await getProgress(userId, courseId)

    return c.json({
      data,
    })
  }
)

export default app
