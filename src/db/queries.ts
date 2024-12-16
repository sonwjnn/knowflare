import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  inArray,
  isNull,
  like,
  lte,
  or,
  sql,
} from 'drizzle-orm'

import { db } from './drizzle'
import {
  CouponType,
  CourseLevel,
  accounts,
  categories,
  chapters,
  coupons,
  courses,
  lessons,
  passwordResetTokens,
  purchases,
  twoFactorTokens,
  userLessonProgress,
  users,
  verificationTokens,
} from './schema'

export const getProgress = async (userId: string | null, courseId: string) => {
  try {
    const publishedChapters = await db
      .select({ id: chapters.id })
      .from(chapters)
      .where(and(eq(chapters.courseId, courseId)))

    const chaptersWithLessons = await Promise.all(
      publishedChapters.map(async chapter => {
        const lessonsData = await db
          .select()
          .from(lessons)
          .where(eq(lessons.chapterId, chapter.id))
          .groupBy(lessons.id)

        return {
          ...chapter,
          lessons: lessonsData,
        }
      })
    )

    const lessonIds = chaptersWithLessons.flatMap(chapter =>
      chapter.lessons.map(lesson => lesson.id)
    )

    const [validCompletedLessons] = await db
      .select({
        count: count(userLessonProgress.lessonId),
      })
      .from(userLessonProgress)
      .where(
        and(
          userId ? eq(userLessonProgress.userId, userId) : undefined,
          eq(userLessonProgress.isCompleted, true),
          inArray(userLessonProgress.lessonId, lessonIds)
        )
      )

    const progressPercentage =
      (validCompletedLessons.count / lessonIds.length) * 100 || 0
    return {
      progressPercentage: +progressPercentage.toFixed(0),
      completedLessons: validCompletedLessons.count,
      totalLessons: lessonIds.length,
    }
  } catch (error) {
    console.log('GET_PROGRESS', error)
    return {
      progressPercentage: null,
      completedLessons: null,
      totalLessons: null,
    }
  }
}
export const getChapters = async (userId: string | null, courseId: string) => {
  const data = await db
    .select()
    .from(chapters)
    .where(eq(chapters.courseId, courseId))
    .orderBy(asc(chapters.position))

  const chaptersWithLessons = await Promise.all(
    data.map(async chapter => {
      const lessonsData = await db
        .select({
          id: lessons.id,
          chapterId: lessons.chapterId,
          courseId: lessons.courseId,
          title: lessons.title,
          description: lessons.description,
          lessonType: lessons.lessonType,
          position: lessons.position,
          isPublished: lessons.isPublished,
          isFree: lessons.isFree,
          videoUrl: lessons.videoUrl,
          duration: lessons.duration,
          question: lessons.question,
          questionType: lessons.questionType,
          isCompleted: sql`CASE WHEN ${userLessonProgress.isCompleted} IS NULL THEN false ELSE ${userLessonProgress.isCompleted} END`,
        })
        .from(lessons)
        .leftJoin(
          userLessonProgress,
          and(
            eq(userLessonProgress.lessonId, lessons.id),
            userId ? eq(userLessonProgress.userId, userId) : undefined
          )
        )
        .where(
          and(eq(lessons.chapterId, chapter.id), eq(lessons.isPublished, true))
        )
        .groupBy(lessons.id)
        .orderBy(asc(lessons.position))

      return {
        ...chapter,
        lessons: lessonsData,
      }
    })
  )
  return chaptersWithLessons
}

const PAGE_SIZE = 12

export const getCourses = async ({
  userId,
  categoryId,
  level,
  title,
  rating,
  pageNumber = 1,
}: {
  userId: string | null | undefined
  categoryId?: string
  level?: string
  title?: string
  rating?: number
  pageNumber?: number
}) => {
  const offset = (pageNumber - 1) * PAGE_SIZE

  const [totalCountResult] = await db
    .select({ count: count(courses.id) })
    .from(courses)
    .where(
      and(
        eq(courses.isPublished, true),
        title ? like(courses.title, `%${title}%`) : undefined,
        categoryId ? eq(courses.categoryId, categoryId) : undefined,
        level ? eq(courses.level, level as CourseLevel) : undefined
      )
    )
    .limit(1)

  const coursesData = await db
    .select({
      id: courses.id,
      title: courses.title,
      description: courses.description,
      imageUrl: courses.imageUrl,
      price: courses.price,
      level: courses.level,
      isPublished: courses.isPublished,
      date: courses.date,
      avgRating: courses.avgRating,
      category: {
        id: categories.id,
        name: categories.name,
      },
      author: {
        id: users.id,
        name: users.name,
      },
      totalChapters: count(chapters.id),
      isPurchased: sql<boolean>`EXISTS (
        SELECT 1 FROM purchases 
        WHERE purchases.course_id = ${courses.id} 
        AND purchases.user_id = ${userId}
      )`,

      couponId: sql`(
        SELECT id 
        FROM coupon 
        WHERE coupon.category_id = ${courses.categoryId} 
        AND coupon.discount_amount = (
          SELECT MAX(discount_amount) 
          FROM coupon 
          WHERE coupon.category_id = ${courses.categoryId} 
        ) 
        ORDER BY id DESC 
        LIMIT 1
      )`,

      discountAmount: sql`(
        SELECT discount_amount 
        FROM coupon 
        WHERE coupon.category_id = ${courses.categoryId} 
        AND coupon.discount_amount = (
          SELECT MAX(discount_amount) 
          FROM coupon 
          WHERE coupon.category_id = ${courses.categoryId} 
        ) 
        ORDER BY id DESC 
        LIMIT 1
      )`,

      discountPrice: sql<number>`(
        course.price - (course.price * (
          SELECT MAX(discount_amount) 
          FROM coupon 
          WHERE coupon.category_id = ${courses.categoryId} 
        ) / 100)
      )`,
    })
    .from(courses)
    .innerJoin(categories, eq(categories.id, courses.categoryId))
    .innerJoin(users, eq(users.id, courses.userId))
    .leftJoin(chapters, eq(chapters.courseId, courses.id))
    .leftJoin(
      coupons,
      and(
        eq(coupons.categoryId, courses.categoryId),
        eq(coupons.isActive, true),
        eq(coupons.type, CouponType.PUBLIC),
        or(
          isNull(coupons.expires),
          gte(coupons.expires, sql`CURRENT_TIMESTAMP`)
        )
      )
    )
    .where(
      and(
        eq(courses.isPublished, true),
        title ? like(courses.title, `%${title}%`) : undefined,
        categoryId ? eq(courses.categoryId, categoryId) : undefined,
        level ? eq(courses.level, level as CourseLevel) : undefined,
        rating ? gte(courses.avgRating, rating) : undefined
      )
    )
    .groupBy(courses.id)
    .orderBy(desc(courses.date))
    .limit(PAGE_SIZE)
    .offset(offset)

  const totalCount = totalCountResult.count || 0
  const pageCount = Math.ceil(totalCount / PAGE_SIZE)

  return { data: coursesData, pageCount }
}

export const getTenLatestCourses = async () => {
  const coursesData = await db
    .select({
      id: courses.id,
      title: courses.title,
      description: courses.description,
      imageUrl: courses.imageUrl,
      price: courses.price,
      level: courses.level,
      isPublished: courses.isPublished,
      date: courses.date,
      avgRating: courses.avgRating,
      category: {
        id: categories.id,
        name: categories.name,
      },
      author: {
        id: users.id,
        name: users.name,
      },
      totalChapters: count(chapters.id),
    })
    .from(courses)
    .innerJoin(categories, eq(categories.id, courses.categoryId))
    .innerJoin(users, eq(users.id, courses.userId))
    .leftJoin(chapters, eq(chapters.courseId, courses.id))
    .where(and(eq(courses.isPublished, true)))
    .groupBy(courses.id)
    .orderBy(desc(courses.date))
    .limit(10)

  return { data: coursesData }
}

export const getFiveTopCoursesLastThreeWeek = async () => {
  const today = new Date()
  const lastWeek = new Date(today)
  lastWeek.setDate(today.getDate() - 7 * 6)

  const coursesData = await db
    .select({
      id: courses.id,
      title: courses.title,
      description: courses.description,
      imageUrl: courses.imageUrl,
      price: courses.price,
      level: courses.level,
      isPublished: courses.isPublished,
      date: courses.date,
      avgRating: courses.avgRating,
      category: {
        id: categories.id,
        name: categories.name,
      },
      author: {
        id: users.id,
        name: users.name,
      },
      totalChapters: count(chapters.id),
      purchasesCount: sql<number>`COUNT(*)`.as('purchases_count'),
    })
    .from(purchases)
    .innerJoin(courses, eq(courses.id, purchases.courseId))
    .innerJoin(categories, eq(categories.id, courses.categoryId))
    .innerJoin(users, eq(users.id, courses.userId))
    .leftJoin(chapters, eq(chapters.courseId, courses.id))
    .where(
      and(
        sql`DATE(${purchases.date}) >= ${lastWeek}`,
        eq(courses.isPublished, true)
      )
    )
    .groupBy(courses.id)
    .orderBy(sql`purchases_count DESC`)
    .limit(5)

  return { data: coursesData }
}

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const [data] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))

    return data
  } catch {
    return null
  }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const [data] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.email, email))

    return data
  } catch {
    return null
  }
}

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const [data] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token))

    return data
  } catch {
    return null
  }
}

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const [data] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.email, email))

    return data
  } catch {
    return null
  }
}

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const [data] = await db
      .select()
      .from(twoFactorTokens)
      .where(eq(twoFactorTokens.email, email))

    return data
  } catch {
    return null
  }
}

export const getAccountByUserId = async (userId: string) => {
  try {
    const [data] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId))

    return data
  } catch {
    return null
  }
}
