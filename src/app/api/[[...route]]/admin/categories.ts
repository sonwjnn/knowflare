import { db } from '@/db/drizzle'
import { categories, insertCategoriesSchema } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { eq, inArray } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .post(
    '/',
    verifyAuth(),
    zValidator(
      'json',
      insertCategoriesSchema.pick({
        name: true,
      })
    ),
    async c => {
      const auth = c.get('authUser')
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
      const values = c.req.valid('json')

      const data = await db.insert(categories).values({
        ...values,
      })

      if (!data) {
        return c.json({ error: 'Something went wrong' }, 400)
      }

      return c.json({ data })
    }
  )
  .patch(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      'json',
      z.object({
        name: z.string().optional(),
      })
    ),
    async c => {
      const values = c.req.valid('json')
      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Id is required!' }, 400)
      }

      const [existingUser] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))

      if (!existingUser) {
        return c.json({ error: 'User does not exist!' }, 400)
      }

      const data = await db
        .update(categories)
        .set({
          ...values,
        })
        .where(eq(categories.id, id))

      if (!data) {
        return c.json({ error: 'Error when update user' }, 404)
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

      if (auth.token?.role !== 'admin') {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { id } = c.req.valid('param')

      if (!id) {
        return c.json({ error: 'Missing id' }, 400)
      }

      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))

      if (!category) {
        return c.json({ error: 'Not found' }, 404)
      }

      const data = await db.delete(categories).where(eq(categories.id, id))

      if (!data) {
        return c.json({ error: 'Error when delete category' }, 404)
      }

      return c.json({ data })
    }
  )
  .post(
    '/bulk-delete',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        ids: z.array(z.string()),
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

      const values = c.req.valid('json')

      if (!values) {
        return c.json({ error: 'Missing values' }, 400)
      }

      const data = await db
        .delete(categories)
        .where(inArray(categories.id, values.ids))

      if (!data) {
        return c.json({ error: 'Error when delete categories' }, 404)
      }

      return c.json({ data })
    }
  )

export default app
