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
    await db.delete(lessons).execute()
    await db.delete(quizAnswers).execute()
    await db.delete(carts).execute()
    await db.delete(purchases).execute()
    await db.delete(wishlists).execute()
    await db.delete(categories).execute()
    await db.delete(chapters).execute()
    await db.delete(courses).execute()
  } catch (error) {
    console.log('Error during seed:', error)
    await connection.end()
    process.exit(1)
  } finally {
    await connection.end()
  }
}

main()
