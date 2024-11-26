import { getChapters } from '@/db/queries'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
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

    const data = await getChapters(auth.token.id, courseId)

    return c.json({
      data,
    } as const)
  }
)

export default app
