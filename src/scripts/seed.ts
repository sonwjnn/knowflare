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
import * as schema from '@/db/schema'
import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'

import { SEED_CATEGORIES } from './categories'
import { SEED_CHAPTERS } from './chapters'
import { SEED_COURSES } from './courses'
import { SEED_LESSONS } from './lessons'
import { SEED_PURCHASES } from './purchases'
import { SEED_USERS } from './users'

config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

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
      lessonType: item.lessonType.toLowerCase() as LessonType,
    }))
    await db.insert(lessons).values(NORMALIZE_SEED_LESSONS).execute()

    console.log('Seeding completed successfully!')
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed database')
  }
}

main()
