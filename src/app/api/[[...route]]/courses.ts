import { db } from '@/db/drizzle'
import {
  getCourses,
  getFiveTopCoursesLastThreeWeek,
  getTenLatestCourses,
} from '@/db/queries'
import {
  CouponType,
  categories,
  chapters,
  coupons,
  courses,
  purchases,
  users,
} from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { count, desc, eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()
  .get(
    '/',
    verifyAuth(),
    zValidator(
      'query',
      z.object({
        categoryId: z.string().optional(),
        title: z.string().optional(),
        level: z.string().optional(),
        pageNumber: z.string().optional(),
        rating: z.string().optional(),
      })
    ),
    async c => {
      const { title, categoryId, level, rating, pageNumber } =
        c.req.valid('query')

      const auth = c.get('authUser')

      const { data, pageCount } = await getCourses({
        title,
        categoryId,
        level,
        pageNumber: +(pageNumber || 1),
        rating: rating ? +rating : undefined,
        userId: auth.token?.id,
      })

      return c.json({
        data,
        pageCount,
      })
    }
  )
  .get(
    '/:id',
    verifyAuth(),
    zValidator('param', z.object({ id: z.string() })),
    zValidator(
      'query',
      z.object({
        couponId: z.string().optional(),
      })
    ),
    async c => {
      const auth = c.get('authUser')
      const { id } = c.req.valid('param')
      const { couponId } = c.req.valid('query')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const [course] = await db
        .select({
          id: courses.id,
          price: courses.price,
          title: courses.title,
          description: courses.description,
          date: courses.date,
          imageUrl: courses.imageUrl,
          isPublished: courses.isPublished,
          categoryId: courses.categoryId,
          level: courses.level,
          avgRating: courses.avgRating,
          user: {
            id: users.id,
            name: users.name,
          },
        })
        .from(courses)
        .innerJoin(users, eq(users.id, courses.userId))
        .where(eq(courses.id, id))

      if (!course) {
        return c.json({ error: 'Not found' }, 404)
      }

      let selectedCoupon = null

      // Tìm couponId được truyền hoặc mã tốt nhất nếu không có couponId
      if (couponId) {
        ;[selectedCoupon] = await db
          .select({
            id: coupons.id,
            discountAmount: coupons.discountAmount,
            expires: coupons.expires,
            code: coupons.code,
          })
          .from(coupons)
          .where(eq(coupons.id, couponId))
          .limit(1)

        if (!selectedCoupon) {
          return c.json({ error: 'Coupon not found' }, 404)
        }
      } else {
        ;[selectedCoupon] = await db
          .select({
            id: coupons.id,
            discountAmount: coupons.discountAmount,
            expires: coupons.expires,
            code: coupons.code,
          })
          .from(coupons)
          .where(
            sql`${coupons.categoryId} = ${course.categoryId} 
                 AND ${coupons.type} = ${CouponType.PUBLIC}
                 AND ${coupons.isActive} = true 
                 AND (${coupons.expires} IS NULL OR ${coupons.expires} > CURRENT_TIMESTAMP)`
          )
          .orderBy(desc(coupons.discountAmount))
          .limit(1)
      }

      const discountPrice = selectedCoupon
        ? course.price - (course.price * selectedCoupon.discountAmount) / 100
        : course.price

      const chaptersData = await db
        .select()
        .from(chapters)
        .where(eq(chapters.courseId, course.id))

      return c.json({
        data: {
          ...course,
          couponId: selectedCoupon?.id ?? null,
          discountAmount: selectedCoupon?.discountAmount ?? null,
          discountPrice,
          discountExpires: selectedCoupon?.expires ?? null,
          discountCode: selectedCoupon?.code ?? null,
          chapters: chaptersData,
        },
      })
    }
  )
  .get('/list/top-courses-last-three-week', async c => {
    const today = new Date()
    const lastWeek = new Date(today)
    lastWeek.setDate(today.getDate() - 7)

    const { data } = await getFiveTopCoursesLastThreeWeek()

    return c.json({ data: data ?? [] })
  })
  .get('/list/latest-courses', async c => {
    const { data } = await getTenLatestCourses()

    return c.json({ data: data ?? [] })
  })

export default app
