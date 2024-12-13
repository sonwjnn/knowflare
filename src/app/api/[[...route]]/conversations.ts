import { db } from '@/db/drizzle'
import { findConversation } from '@/db/queries'
import { conversations } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

const DIRECT_MESSAGES_BATCH = 10

const app = new Hono().post(
  '/get-or-create',
  verifyAuth(),
  zValidator(
    'json',
    z.object({ userOneId: z.string(), userTwoId: z.string() })
  ),
  async c => {
    const auth = c.get('authUser')
    if (!auth.token?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { userOneId, userTwoId } = c.req.valid('json')

    let conversation =
      (await findConversation(userOneId, userTwoId)) ||
      (await findConversation(userTwoId, userOneId))

    if (!conversation) {
      const [ok] = await db
        .insert(conversations)
        .values({ userOneId, userTwoId })

      if (!ok) return c.json({ error: 'Cant create data' }, 401)

      conversation = await findConversation(userOneId, userTwoId)
    }

    return c.json({
      data: conversation,
    })
  }
)

export default app
