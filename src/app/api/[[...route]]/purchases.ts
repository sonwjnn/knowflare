import { db } from '@/db/drizzle'
import { getProgress } from '@/db/queries'
import { categories, chapters, courses, purchases } from '@/db/schema'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono().get(
  '/courses',
  verifyAuth(),
  zValidator(
    'query',
    z.object({
      title: z.string().optional(),
      categoryId: z.string().optional(),
    })
  ),
  async c => {
    const auth = c.get('authUser')

    if (!auth.token?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const purchasedCourses = await db
      .select({
        id: courses.id,
        title: courses.title,
        imageUrl: courses.imageUrl,
        description: courses.description,
        price: courses.price,
        isPublished: courses.isPublished,
        date: courses.date,
        category: {
          name: categories.name,
        },
      })
      .from(purchases)
      .innerJoin(courses, eq(purchases.courseId, courses.id))
      .innerJoin(categories, eq(courses.categoryId, categories.id))
      .where(eq(purchases.userId, auth.token.id))

    const coursesWithChapters = await Promise.all(
      purchasedCourses.map(async course => {
        const courseChapters = await db
          .select({
            id: chapters.id,
            title: chapters.title,
            description: chapters.description,
            videoUrl: chapters.videoUrl,
            position: chapters.position,
            isPublished: chapters.isPublished,
          })
          .from(chapters)
          .where(
            and(
              eq(chapters.courseId, course.id),
              eq(chapters.isPublished, true)
            )
          )
          .orderBy(chapters.position)

        return {
          ...course,
          chapters: courseChapters,
        }
      })
    )

    const progresses: { courseId: string; progress: number }[] = []

    for (let course of coursesWithChapters) {
      const progress = await getProgress(auth.token?.id, course.id)
      progresses.push({
        courseId: course.id,
        progress,
      })
    }

    const finalCoursesData = coursesWithChapters.map(course => {
      const foundProgress = progresses.find(
        progress => progress.courseId === course.id
      )
      return {
        ...course,
        progress: foundProgress ? foundProgress.progress : 0,
      }
    })

    const completedCourses = finalCoursesData.filter(
      course => course.progress === 100
    )
    const coursesInProgress = finalCoursesData.filter(
      course => (course.progress ?? 0) < 100
    )

    return c.json({
      data: {
        completedCourses,
        coursesInProgress,
      },
    })
  }
)

export default app
