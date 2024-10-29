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
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

import {
  SEED_CATEGORIES,
  SEED_CHAPTERS,
  SEED_COURSES,
  SEED_LESSONS,
} from './data'

config({ path: '.env.local' })

const connection = mysql.createPool({
  host: process.env.DATABASE_HOST!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
})

const db = drizzle(connection)

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

    // Seed categories
    await db.insert(categories).values(SEED_CATEGORIES).execute()

    // Seed courses
    await db.insert(courses).values(SEED_COURSES).execute()

    // Seed chapters
    await db.insert(chapters).values(SEED_CHAPTERS).execute()

    // Seed lessons
    await db.insert(lessons).values(SEED_LESSONS).execute()

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
