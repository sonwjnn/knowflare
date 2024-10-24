import { db } from '@/db/drizzle'
import { categories, subCategories } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono().get('/', async c => {
  const data = await db.select().from(categories).orderBy(desc(categories.name))

  if (!data) {
    return c.json({ error: 'Not found' }, 404)
  }

  const categoriesWithSubCategories = await Promise.all(
    data.map(async category => ({
      ...category,
      subCategories: await db
        .select()
        .from(subCategories)
        .where(eq(subCategories.parentId, category.id)),
    }))
  )

  if (!categoriesWithSubCategories) {
    return c.json({ error: 'Not found' }, 404)
  }

  return c.json({
    data: categoriesWithSubCategories,
  })
})

export default app
