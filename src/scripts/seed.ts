import {
  attachments,
  carts,
  categories,
  chapters,
  comments,
  courses,
  orders,
  purchases,
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
    await db.delete(users).execute()
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

    const userId = '48ee14d7-953b-4a2e-a92b-14d8d8f60fff'

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

    // Create chapters for each course
    for (const courseId of courseIds) {
      const chapterIds = Array.from({ length: 5 }, () => uuidv4())
      const SEED_CHAPTERS = chapterIds.map((id, index) => ({
        id,
        courseId,
        title: `Chapter Title ${index + 1} for Course ${courseId}`,
        description: `Description for Chapter Title ${index + 1}`,
        videoUrl: `http://example.com/video${index + 1}.mp4`,
        position: index + 1,
        isPublished: Math.random() < 0.5,
        isFree: Math.random() < 0.5,
      }))

      // Seed chapters
      await db.insert(chapters).values(SEED_CHAPTERS).execute()
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
