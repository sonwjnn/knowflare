import { categories, chapters, courses } from '@/db/schema'
import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import { v4 as uuidv4 } from 'uuid'

config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function main() {
  try {
    // Reset db
    await db.delete(chapters).execute()
    await db.delete(courses).execute()
    await db.delete(categories).execute()

    const userId = ''

    const categoryIds = Array.from({ length: 8 }, (_, i) => uuidv4())

    const SEED_CATEGORIES = [
      { id: categoryIds[1], name: 'Computer Science' },
      { id: categoryIds[2], name: 'Music' },
      { id: categoryIds[3], name: 'Fitness' },
      { id: categoryIds[4], name: 'Photography' },
      { id: categoryIds[5], name: 'Accounting' },
      { id: categoryIds[6], name: 'Engineering' },
      { id: categoryIds[7], name: 'Filming' },
    ]

    // Seed categories
    await db.insert(categories).values(SEED_CATEGORIES).execute()

    // Create courses
    const courseIds = Array.from({ length: 10 }, () => uuidv4())
    const SEED_COURSES = courseIds.map((id, index) => ({
      id,
      userId: uuidv4(), // Replace with a valid user ID
      categoryId: categoryIds[index % categoryIds.length], // Assign categories in a round-robin manner
      title: `Course Title ${index + 1}`,
      description: `Description for Course Title ${index + 1}`,
      imageUrl: `http://example.com/image${index + 1}.jpg`,
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
    process.exit(1)
  }
}

main()
