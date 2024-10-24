import { db } from '@/db/drizzle'
import { categories } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono().get('/', async c => {
  const data = await db.select().from(categories).orderBy(desc(categories.name))

  if (!data) {
    return c.json({ error: 'Not found' }, 404)
  }

  return c.json({
    data,
  })
})

export default app
