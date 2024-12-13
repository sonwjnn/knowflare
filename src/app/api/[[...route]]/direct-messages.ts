import { db } from '@/db/drizzle'
import {
  categories,
  conversations,
  directMessages,
  insertCategoriesSchema,
  users,
} from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, desc, eq, inArray, lt, or } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const DIRECT_MESSAGES_BATCH = 10

const app = new Hono()
  .get(
    '/',
    verifyAuth(),
    zValidator(
      'query',
      z.object({ conversationId: z.string(), cursor: z.string().optional() })
    ),
    async c => {
      const auth = c.get('authUser')
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { conversationId, cursor } = c.req.valid('query')

      const data = await db
        .select({
          id: directMessages.id,
          content: directMessages.content,
          createdAt: directMessages.createdAt,
          conversationId: directMessages.conversationId,
          userId: directMessages.userId,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
          },
        })
        .from(directMessages)
        .innerJoin(users, eq(users.id, directMessages.userId))
        .where(
          cursor
            ? and(
                eq(directMessages.conversationId, conversationId),
                lt(directMessages.id, cursor)
              )
            : eq(directMessages.conversationId, conversationId)
        )
        .orderBy(desc(directMessages.createdAt))
        .limit(DIRECT_MESSAGES_BATCH)

      // Determine next cursor
      let nextCursor = null
      if (data.length === DIRECT_MESSAGES_BATCH) {
        nextCursor = data[DIRECT_MESSAGES_BATCH - 1].id
      }

      return c.json({
        data: {
          items: data,
          nextCursor,
        },
      })
    }
  )
  .post(
    '/',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        conversationId: z.string(),
        content: z.string(),
        fileUrl: z.string().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { conversationId, content, fileUrl } = c.req.valid('json')

      if (!content && !fileUrl) {
        return c.json({ error: 'Missing data' }, 401)
      }

      const [conversation] = await db
        .select({
          id: conversations.id,
          userOneId: conversations.userOneId,
          userTwoId: conversations.userTwoId,
        })
        .from(conversations)

        .where(
          and(
            eq(conversations.id, conversationId),
            or(
              eq(conversations.userOneId, auth.token.id),
              eq(conversations.userTwoId, auth.token.id)
            )
          )
        )
        .limit(1)

      if (!conversation) {
        return c.json({ error: 'Conversation not found' }, 404)
      }

      const [message] = await db.insert(directMessages).values({
        content,
        fileUrl,
        conversationId,
        userId: auth.token.id,
      })

      const io = c.get('io')

      const channelKey = `chat:${conversationId}:messages`

      io.emit(channelKey, {
        content,
        fileUrl,
        conversationId,
        user: {
          id: auth.token.id,
          name: auth.token.name,
          email: auth.token.email,
          image: auth.token.image,
        },
      })

      return c.json({
        data: message,
      })
    }
  )

export default app
