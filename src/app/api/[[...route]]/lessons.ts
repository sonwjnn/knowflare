import { db } from '@/db/drizzle'
import { lessons } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, asc, desc, eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono().get(
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

export default app
