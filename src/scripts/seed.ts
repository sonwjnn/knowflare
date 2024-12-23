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

import { SEED_CATEGORIES } from './categories'
import { SEED_CHAPTERS } from './chapters'
import { SEED_COURSES } from './courses'
import { SEED_LESSONS } from './lessons'
import { SEED_PURCHASES } from './purchases'
import { SEED_USERS } from './users'

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
    await db.delete(users).execute()
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
    await db.insert(users).values(SEED_USERS).execute()
    await db.insert(categories).values(SEED_CATEGORIES).execute()

    // Seed courses
    await db.insert(courses).values(SEED_COURSES).execute()
    await db.insert(purchases).values(SEED_PURCHASES).execute()

    // Seed chapters
    await db.insert(chapters).values(SEED_CHAPTERS).execute()

    // Seed lessons
    const NORMALIZE_SEED_LESSONS = SEED_LESSONS.map(item => ({
      ...item,
      lessonType: item.lessonType as LessonType,
    }))
    await db.insert(lessons).values(NORMALIZE_SEED_LESSONS).execute()

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
