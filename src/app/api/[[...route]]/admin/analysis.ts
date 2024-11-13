import { db } from '@/db/drizzle'
import { courses, orders, purchases } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { differenceInDays, isAfter, isBefore, parse, subDays } from 'date-fns'
import { and, eq, gte, lte, sql } from 'drizzle-orm'
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

const getAllMonthsBetween = (startDate: Date, endDate: Date) => {
  const months: string[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    months.push(
      currentDate.toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    )
    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return months
}

const app = new Hono()
  .get('/courses', verifyAuth(), async c => {
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
  })
  .get(
    '/monthly',
    verifyAuth(),
    zValidator(
      'query',
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        // accountId: z.string().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')
      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { from, to } = c.req.valid('query')

      const defaultTo = new Date()
      const defaultFrom = subDays(defaultTo, 30 * 12)

      const startDate = from
        ? parse(from, 'yyyy-MM-dd', new Date())
        : defaultFrom

      const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo

      const periodLength = differenceInDays(endDate, startDate)
      const lastPeriodStart = subDays(startDate, periodLength)
      const lastPeriodEnd = subDays(endDate, periodLength)

      const purchasesData = await db
        .select({
          date: purchases.date,
          price: courses.price,
        })
        .from(purchases)
        .innerJoin(courses, eq(courses.id, purchases.courseId))
        .where(
          and(gte(purchases.date, startDate), lte(purchases.date, endDate))
        )

      const allMonths = getAllMonthsBetween(startDate, endDate)
      let monthlyData: { [key: string]: { revenue: number; sales: number } } =
        {}

      allMonths.forEach(month => {
        monthlyData[month] = { revenue: 0, sales: 0 }
      })

      purchasesData.forEach(item => {
        const date = new Date(item.date ?? '')

        const monthKey = date.toLocaleString('en-US', {
          month: 'short',
          year: 'numeric',
        })

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { revenue: 0, sales: 0 }
        }

        monthlyData[monthKey].revenue += item.price
        monthlyData[monthKey].sales += 1
      })

      const formattedData = Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          revenue: data.revenue ?? 0,
          sales: data.sales ?? 0,
        }))
        .sort((a, b) => {
          const [aMonth, aYear] = a.month.split(' ')
          const [bMonth, bYear] = b.month.split(' ')
          const monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ]

          if (aYear !== bYear) {
            return parseInt(aYear) - parseInt(bYear)
          }
          return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth)
        })

      return c.json({
        data: formattedData,
      })
    }
  )

export default app
