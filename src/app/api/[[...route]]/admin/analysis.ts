import { db } from '@/db/drizzle'
import { courses, orders, purchases } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const groupByCourse = (purchasesData: { title: string; price: number }[]) => {
  const grouped: { [courseTitle: string]: number } = {}

  purchasesData.forEach(item => {
    const courseTitle = item.title
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0
    }
    grouped[courseTitle] += item.price!
  })
  return grouped
}

const app = new Hono().get(
  '/',
  verifyAuth(),

  async c => {
    const auth = c.get('authUser')

    if (!auth.token?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    const purchasesData = await db
      .select({
        title: courses.title,
        price: courses.price,
      })
      .from(purchases)
      .innerJoin(courses, eq(courses.id, purchases.courseId))

    const groupedEarnings = groupByCourse(purchasesData)
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total: total,
      })
    )

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0)
    const totalSales = purchasesData.length

    return c.json({
      data: {
        data,
        totalRevenue,
        totalSales,
      },
    })
  }
)

export default app
