import {
  LessonType,
  QuestionType,
  attachments,
  carts,
  categories,
  chapters,
  comments,
  courses,
  lessons,
  orders,
  purchases,
  quizAnswers,
  reviews,
  subscriptions,
  users,
  wishlists,
} from '@/db/schema'
import { CourseLevel } from '@/db/schema'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'

import { SEED_CATEGORIES, SEED_SUB_CATEGORIES } from './data'

config({ path: '.env.local' })

const connection = mysql.createPool({
  host: process.env.DATABASE_HOST!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
})

const db = drizzle(connection)

function getRandomImageUrl(): string {
  const randomId = Math.floor(Math.random() * 1000)
  return `https://picsum.photos/id/${randomId}/200/200`
}

function getRandomLevel() {
  const levels = Object.values(CourseLevel)
  return levels[Math.floor(Math.random() * levels.length)]
}

async function main() {
  try {
    // Reset db
    await db.delete(orders).execute()
    await db.delete(subscriptions).execute()
    await db.delete(reviews).execute()
    await db.delete(comments).execute()
    await db.delete(attachments).execute()
    await db.delete(carts).execute()
    await db.delete(purchases).execute()
    await db.delete(wishlists).execute()
    await db.delete(categories).execute()
    await db.delete(chapters).execute()
    await db.delete(courses).execute()

    const userId = 'f669b609-f13a-44fe-b75a-0a5b22fb87ca'

    // Seed categories
    await db.insert(categories).values(SEED_CATEGORIES).execute()

    // Get all sub-category IDs
    const categoryIds = SEED_CATEGORIES.map(cat => cat.id)

    // Create courses
    const courseIds = Array.from({ length: 30 }, () => uuidv4())
    const SEED_COURSES = courseIds.map((id, index) => ({
      id,
      userId,
      categoryId: categoryIds[index % categoryIds.length],
      title: `Course Title ${index + 1}`,
      description: `Description for Course Title ${index + 1}`,
      imageUrl: getRandomImageUrl(),
      price: Math.floor(Math.random() * 100) + 1,
      isPublished: Math.random() < 0.5,
      level: getRandomLevel(),
      date: new Date(),
    }))

    // Seed courses
    await db.insert(courses).values(SEED_COURSES).execute()

    for (const courseId of courseIds) {
      const chapterIds = Array.from({ length: 5 }, () => uuidv4())

      const SEED_CHAPTERS = chapterIds.map((id, index) => ({
        id,
        courseId,
        title: `Chapter Title ${index + 1} for Course`,
        description: `Description for Chapter Title ${index + 1}`,
        position: index + 1,
        isPublished: Math.random() < 0.5,
        isFree: Math.random() < 0.5,
      }))

      // Seed chapters
      await db.insert(chapters).values(SEED_CHAPTERS).execute()

      // Create lessons for each chapter
      let accumulatedPosition = 0

      for (const chapter of SEED_CHAPTERS) {
        const lessonIds = Array.from({ length: 3 }, () => uuidv4())
        const SEED_LESSONS = lessonIds.map((id, index) => {
          const isVideo = Math.random() < 0.7 // 70% chance of being a video lesson
          accumulatedPosition += 1
          return {
            id,
            courseId: chapter.courseId,
            chapterId: chapter.id,
            title: `Lesson Title ${index + 1} for Chapter`,
            description: `Description for Lesson Title ${index + 1}`,
            lessonType: isVideo ? LessonType.VIDEO : LessonType.QUIZ,
            position: accumulatedPosition,
            isPublished: Math.random() < 0.5,
            isFree: Math.random() < 0.5,
            videoUrl: isVideo
              ? `http://example.com/lesson${index + 1}.mp4`
              : null,
            duration: isVideo ? Math.floor(Math.random() * 3600) : null, // Random duration up to 1 hour
            question: isVideo ? null : `Question for Quiz Lesson ${index + 1}?`,
          }
        })

        // Seed lessons
        await db.insert(lessons).values(SEED_LESSONS).execute()

        // Create quiz answers for quiz lessons
        for (const lesson of SEED_LESSONS) {
          if (lesson.lessonType === LessonType.QUIZ) {
            const answerIds = Array.from({ length: 4 }, () => uuidv4())
            const SEED_ANSWERS = answerIds.map((id, index) => ({
              id,
              lessonId: lesson.id,
              content: `Answer ${index + 1} for Quiz Lesson`,
              isCorrect: index === 0, // First answer is correct
              explanation: `Explanation for Answer ${index + 1}`,
            }))
            await db.insert(quizAnswers).values(SEED_ANSWERS).execute()
          }
        }
      }
    }

    console.log('Seeding completed successfully!')
  } catch (error) {
    console.log('Error during seed:', error)
    await connection.end()
    process.exit(1)
  } finally {
    await connection.end()
  }
}

main()
