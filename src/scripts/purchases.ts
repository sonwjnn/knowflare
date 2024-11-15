import { v4 as uuidv4 } from 'uuid'

import { SEED_COURSES } from './courses'
import { SEED_USERS } from './users'

function generatePurchasesForMonth(year: number, month: number) {
  const numPurchases = Math.floor(Math.random() * 3) + 3 // 3 to 5 purchases
  const purchases = []
  const purchasedCoursesThisMonth = new Set()

  for (let i = 0; i < numPurchases; i++) {
    let userId, courseId
    do {
      userId = SEED_USERS[Math.floor(Math.random() * SEED_USERS.length)].id
      courseId =
        SEED_COURSES[Math.floor(Math.random() * SEED_COURSES.length)].id
    } while (purchasedCoursesThisMonth.has(`${userId}-${courseId}`))

    purchasedCoursesThisMonth.add(`${userId}-${courseId}`)

    const date = new Date(year, month - 1, Math.floor(Math.random() * 28) + 1)

    purchases.push({
      id: uuidv4(),
      userId: userId,
      courseId: courseId,
      date: date,
    })
  }
  return purchases
}

export const SEED_PURCHASES = [] as {
  id: string
  userId: string
  courseId: string
  date: Date
}[]
for (let month = 1; month <= 11; month++) {
  SEED_PURCHASES.push(...generatePurchasesForMonth(2024, month))
}
