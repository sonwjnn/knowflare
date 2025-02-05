import { db } from '@/db/drizzle'
import { UserRole, courses, users } from '@/db/schema'
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
        fullName: users.fullName,
        bio: users.bio,
        isTwoFactorEnabled: users.isTwoFactorEnabled,
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

      const data = await db.delete(users).where(eq(users.id, id))

      if (!data) {
        return c.json({ error: 'Not found' }, 404)
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
        role: UserRole.USER,
      })

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
        role: z.string().optional(),
        image: z.string().optional(),
        emailVerified: z.string().optional(),
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
        .from(users)
        .where(eq(users.id, id))

      if (!existingUser) {
        return c.json({ error: 'User does not exist!' }, 400)
      }

      const data = await db
        .update(users)
        .set({
          ...values,
          role: values.role ? (values.role as UserRole) : undefined,
          emailVerified: values.emailVerified
            ? new Date(values.emailVerified)
            : null,
        })
        .where(eq(users.id, id))

      if (!data) {
        return c.json({ error: 'Error when update user' }, 404)
      }

      return c.json({ data })
    }
  )

export default app
