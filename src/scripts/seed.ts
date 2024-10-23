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

    const userId = '9c0ca8ce-12ab-4d0f-8faf-1e5a6afeafed'

    const SEED_CATEGORIES = [
      { id: uuidv4(), name: 'IT' },
      { id: uuidv4(), name: 'Health' },
      { id: uuidv4(), name: 'Language' },
      { id: uuidv4(), name: 'Business' },
      { id: uuidv4(), name: 'Management' },
      { id: uuidv4(), name: 'English' },
      { id: uuidv4(), name: 'Personal Development' },
      { id: uuidv4(), name: 'Sales & Marketing' },
      { id: uuidv4(), name: 'Engineering & Construction' },
      { id: uuidv4(), name: 'Teaching & Academics' },
    ]

    // Seed categories
    await db.insert(categories).values(SEED_CATEGORIES).execute()

    // Retrieve inserted category IDs
    const categoryIds = SEED_CATEGORIES.map(cat => cat.id)

    // Create courses
    const courseIds = Array.from({ length: 30 }, () => uuidv4())
    const SEED_COURSES = courseIds.map((id, index) => ({
      id,
      userId,
      categoryId: categoryIds[index % categoryIds.length], // Ensure valid category ID
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
        title: `Chapter Title ${index + 1} for Course ${courseId}`,
        description: `Description for Chapter Title ${index + 1}`,
        position: index + 1,
        isPublished: Math.random() < 0.5,
        isFree: Math.random() < 0.5,
      }))

      // Seed chapters
      await db.insert(chapters).values(SEED_CHAPTERS).execute()

      // Create lessons for each chapter
      for (const chapterId of chapterIds) {
        const lessonIds = Array.from({ length: 3 }, () => uuidv4())
        const SEED_LESSONS = lessonIds.map((id, index) => {
          const isVideo = Math.random() < 0.7 // 70% chance of being a video lesson
          return {
            id,
            chapterId,
            title: `Lesson Title ${index + 1} for Chapter ${chapterId}`,
            description: `Description for Lesson Title ${index + 1}`,
            lessonType: isVideo ? LessonType.VIDEO : LessonType.QUIZ,
            position: index + 1,
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
              content: `Answer ${index + 1} for Quiz Lesson ${lesson.id}`,
              isCorrect: index === 0, // First answer is correct
              explanation: `Explanation for Answer ${index + 1}`,
            }))
            await db.insert(quizAnswers).values(SEED_ANSWERS).execute()
          }
        }
      }
    }
  } catch (error) {
    console.log('Error during seed:', error)
    await connection.end()
    process.exit(1)
  } finally {
    await connection.end()
  }
}

main()
