import { categories } from '@/db/schema'
import { neon } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import { v4 as uuidv4 } from 'uuid'

config({ path: '.env' })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

// const generateRandomAmount = (category: typeof categories.$inferInsert) => {
//   switch (category.name) {
//     case "Rent":
//       return Math.random() * 400 + 90;
//     case "Utilities":
//       return Math.random() * 200 + 50;
//     case "Food":
//       return Math.random() * 30 + 10;
//     case "Transportation":
//     case "Health":
//       return Math.random() * 50 + 15;
//     case "Entertainment":
//     case "Clothing":
//     case "Miscellaneous":
//       return Math.random() * 100 + 20;
//     default:
//       return Math.random() * 50 + 10;
//   }
// };

async function main() {
  try {
    //Reset db
    await db.delete(categories).execute()

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
    // Seed accounts
  } catch (error) {
    console.log('Error during seed:', error)
    process.exit(1)
  }
}

main()
