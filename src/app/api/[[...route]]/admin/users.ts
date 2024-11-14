import { db } from '@/db/drizzle'
import { courses, users } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import bcrypt from 'bcryptjs'
import { eq, inArray, isNotNull } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get('/', verifyAuth(), async c => {
    const auth = c.get('authUser')
    if (!auth.token?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    const data = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        emailVerified: users.emailVerified,
        image: users.image,
      })
      .from(users)

    return c.json({ data })
  })
  .get('/list/have-course', verifyAuth(), async c => {
    const auth = c.get('authUser')

    if (!auth.token?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const data = await db
      .selectDistinct({
        id: users.id,
        name: users.name,
      })
      .from(users)
      .innerJoin(courses, eq(courses.userId, users.id))
      .where(isNotNull(courses.userId))

    return c.json({
      data: data ?? [],
    })
  })
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

      const [user] = await db.select().from(users).where(eq(users.id, id))

      if (!user) {
        return c.json({ error: 'Not found' }, 404)
      }

      const [deletedChapter] = await db.delete(users).where(eq(users.id, id))

      return c.json({ data: deletedChapter })
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

      const data = await db.delete(users).where(inArray(users.id, values.ids))

      return c.json({ data })
    }
  )

  .post(
    '/',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(3).max(20),
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

      const { name, email, password } = c.req.valid('json')

      const hashedPassword = await bcrypt.hash(password, 12)

      const [data] = await db.select().from(users).where(eq(users.email, email))

      if (data) {
        return c.json({ error: 'Email already in use' }, 400)
      }

      await db.insert(users).values({
        email,
        name,
        password: hashedPassword,
        emailVerified: new Date(),
      })

      return c.json({ data })
    }
  )

export default app
