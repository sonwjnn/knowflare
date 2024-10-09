import { db } from '@/db/drizzle'
import { categories } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { desc } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono().get('/', verifyAuth(), async c => {
  // const auth = c.get('authUser')

  // if (!auth.token?.id) {
  //   return c.json({ error: 'Unauthorized' }, 401)
  // }

  const data = await db.select().from(categories).orderBy(desc(categories.name))

  if (!data) {
    return c.json({ error: 'Not found' }, 404)
  }

  return c.json({
    data,
  })
})

export default app
