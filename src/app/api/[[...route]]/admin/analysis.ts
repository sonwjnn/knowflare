import { db } from '@/db/drizzle'
import { categories, courses, purchases } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { parse, subDays } from 'date-fns'
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm'
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
    '/',
    verifyAuth(),
    zValidator(
      'query',
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
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
      let monthlyData: { [key: string]: { revenue: number } } = {}

      allMonths.forEach(month => {
        monthlyData[month] = { revenue: 0 }
      })

      purchasesData.forEach(item => {
        const date = new Date(item.date ?? '')

        const monthKey = date.toLocaleString('en-US', {
          month: 'short',
          year: 'numeric',
        })

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { revenue: 0 }
        }

        monthlyData[monthKey].revenue += item.price
      })

      const formattedData = Object.entries(monthlyData)
        .map(([month, data]) => ({
          date: month, // đổi 'month' thành 'date'
          revenue: data.revenue ?? 0,
        }))
        .sort((a, b) => {
          const [aMonth, aYear] = a.date.split(' ')
          const [bMonth, bYear] = b.date.split(' ')
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

      const category = await db
        .select({
          name: categories.name,
          value: sql`SUM(ABS(${courses.price}))`.mapWith(Number),
        })
        .from(purchases)
        .innerJoin(courses, eq(purchases.courseId, courses.id))
        .innerJoin(categories, eq(courses.categoryId, categories.id))
        .where(
          and(gte(purchases.date, startDate), lte(purchases.date, endDate))
        )
        .groupBy(categories.name)
        .orderBy(desc(sql`SUM(ABS(${courses.price}))`))

      const topCategories = category.slice(0, 3)
      const otherCategories = category.slice(3)
      const otherSum = otherCategories.reduce(
        (sum, current) => sum + current.value,
        0
      )

      const finalCategories = topCategories

      if (otherCategories.length > 0) {
        finalCategories.push({
          name: 'Other',
          value: otherSum,
        })
      }

      return c.json({
        data: {
          days: formattedData,
          categories: finalCategories,
        },
      })
    }
  )

  .get('/overview', verifyAuth(), async c => {
    const auth = c.get('authUser')
    if (!auth.token?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const currentYear = new Date().getFullYear()
    const startDate = new Date(currentYear, 0, 1)
    const endDate = new Date(currentYear, 11, 31)

    const purchasesData = await db
      .select({
        date: purchases.date,
        price: courses.price,
      })
      .from(purchases)
      .innerJoin(courses, eq(courses.id, purchases.courseId))

    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(currentYear, index, 1)
      return {
        date: date.toLocaleString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        revenue: 0,
      }
    })

    purchasesData.forEach(item => {
      const date = new Date(item.date ?? '')
      const monthIndex = date.getMonth()

      if (!monthlyData[monthIndex]) {
        return (monthlyData[monthIndex] = { revenue: 0, date: '' })
      }
      monthlyData[monthIndex].revenue += item.price
    })

    const totalRevenue = purchasesData.reduce(
      (sum, item) => sum + item.price,
      0
    )
    const totalSales = purchasesData.length

    return c.json({
      data: {
        data: monthlyData,
        totalRevenue,
        totalSales,
      },
    })
  })

export default app
