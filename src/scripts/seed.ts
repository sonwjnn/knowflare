import { categories, chapters, courses } from '@/db/schema'
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

async function main() {
  try {
    // Reset db
    await db.delete(chapters).execute()
    await db.delete(courses).execute()
    await db.delete(categories).execute()

    const userId = 'fa0569b1-1954-43d5-a586-b5176523fde6'

    const categoryIds = Array.from({ length: 8 }, (_, i) => uuidv4())

    const SEED_CATEGORIES = [
      { id: categoryIds[1], name: 'IT' },
      { id: categoryIds[2], name: 'Health' },
      { id: categoryIds[3], name: 'Language' },
      { id: categoryIds[4], name: 'Business' },
      { id: categoryIds[5], name: 'Management' },
      { id: categoryIds[6], name: 'English' },
      { id: categoryIds[7], name: 'Personal Development' },
      { id: categoryIds[8], name: 'Sales & Marketing' },
      { id: categoryIds[9], name: 'Engineering & Construction' },
      { id: categoryIds[10], name: 'Teaching & Academics' },
    ]

    // Seed categories
    await db.insert(categories).values(SEED_CATEGORIES)

    // Create courses
    const courseIds = Array.from({ length: 30 }, () => uuidv4())
    const SEED_COURSES = courseIds.map((id, index) => ({
      id,
      userId, // Replace with a valid user ID
      categoryId: categoryIds[index % categoryIds.length], // Assign categories in a round-robin manner
      title: `Course Title ${index + 1}`,
      description: `Description for Course Title ${index + 1}`,
      imageUrl: getRandomImageUrl(),
      price: Math.floor(Math.random() * 100) + 1,
      isPublished: Math.random() < 0.5,
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
