import { relations } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import {
  boolean,
  datetime,
  float,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core'
import { createInsertSchema } from 'drizzle-zod'
import type { AdapterAccountType } from 'next-auth/adapters'
import { z } from 'zod'

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any
}

export const roleEnum = mysqlEnum('role', enumToPgEnum(UserRole))

export const users = mysqlTable('user', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  emailVerified: datetime('emailVerified', {
    mode: 'date',
    fsp: 3,
  })
    .$type<Date | null>()
    .default(null),
  role: roleEnum.default(UserRole.USER).notNull(),
  image: varchar('image', { length: 255 }),
  password: varchar('password', { length: 255 }),
})

export const insertUsersSchema = createInsertSchema(users)

export const accounts = mysqlTable(
  'account',
  {
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 255 })
      .$type<AdapterAccountType>()
      .notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: varchar('refresh_token', { length: 255 }),
    access_token: varchar('access_token', { length: 255 }),
    expires_at: int('expires_at'),
    token_type: varchar('token_type', { length: 255 }),
    scope: varchar('scope', { length: 255 }),
    id_token: varchar('id_token', { length: 2048 }),
    session_state: varchar('session_state', { length: 255 }),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = mysqlTable('session', {
  sessionToken: varchar('sessionToken', { length: 255 }).primaryKey(),
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = mysqlTable(
  'verification_token',
  {
    email: varchar('email', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  verificationToken => ({
    compositePk: primaryKey({
      columns: [verificationToken.email, verificationToken.token],
    }),
  })
)

export const authenticators = mysqlTable(
  'authenticator',
  {
    credentialID: varchar('credentialID', { length: 255 }).notNull().unique(),
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    credentialPublicKey: varchar('credentialPublicKey', {
      length: 255,
    }).notNull(),
    counter: int('counter').notNull(),
    credentialDeviceType: varchar('credentialDeviceType', {
      length: 255,
    }).notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: varchar('transports', { length: 255 }),
  },
  authenticator => ({
    compositePk: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)

export const passwordResetTokens = mysqlTable(
  'password_reset_token',
  {
    email: varchar('email', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  passwordResetTokens => ({
    compositePk: primaryKey({
      columns: [passwordResetTokens.email, passwordResetTokens.token],
    }),
  })
)

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ALL_LEVEL = 'all level',
}

export const levelEnum = mysqlEnum('level', enumToPgEnum(CourseLevel))

export const courses = mysqlTable('course', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  categoryId: varchar('category_id', { length: 255 }).references(
    () => categories.id,
    {
      onDelete: 'set null',
    }
  ),
  level: levelEnum.default(CourseLevel.ALL_LEVEL).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  imageUrl: varchar('image_url', { length: 255 }),
  price: int('price').default(0).notNull(),
  avgRating: float('avg_rating').default(0).notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  date: timestamp('date', { mode: 'date' }).notNull(),
})

export const coursesRelations = relations(courses, ({ many, one }) => ({
  category: one(categories, {
    fields: [courses.categoryId],
    references: [categories.id],
  }),
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
  chapters: many(chapters),
  attachments: many(attachments),
  purchases: many(purchases),
}))

export const insertCoursesSchema = createInsertSchema(courses, {
  date: z.coerce.date(),
})

export const categories = mysqlTable('category', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
})

export const insertCategoriesSchema = createInsertSchema(categories)

export const attachments = mysqlTable('attachment', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: varchar('course_id', { length: 255 })
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
  name: varchar('name', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  date: timestamp('date', { mode: 'date' }).notNull(),
})

export const attachmentsInsertSchema = createInsertSchema(attachments, {
  date: z.coerce.date(),
})

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  course: one(courses, {
    fields: [attachments.courseId],
    references: [courses.id],
  }),
}))

export const chapters = mysqlTable('chapter', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: varchar('course_id', { length: 255 })
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  position: int('position').notNull(),
  isPublished: boolean('is_published').default(false),
})

export const insertChaptersSchema = createInsertSchema(chapters)

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, {
    fields: [chapters.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}))

export enum LessonType {
  VIDEO = 'video',
  QUIZ = 'quiz',
}

export const lessonTypeEnum = mysqlEnum('lesson_type', enumToPgEnum(LessonType))

export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
}

export const questionTypeEnum = mysqlEnum('type', enumToPgEnum(QuestionType))

export const lessons = mysqlTable('lesson', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: varchar('course_id', { length: 255 })
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
  chapterId: varchar('chapter_id', { length: 255 })
    .notNull()
    .references(() => chapters.id, {
      onDelete: 'cascade',
    }),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  lessonType: lessonTypeEnum.default(LessonType.VIDEO).notNull(),
  position: int('position').notNull(),
  isPublished: boolean('is_published').default(false),
  isFree: boolean('is_free').default(false),

  videoUrl: varchar('video_url', { length: 255 }),
  duration: int('duration'),

  question: varchar('question', { length: 255 }),
  questionType: questionTypeEnum,
})

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [lessons.chapterId],
    references: [chapters.id],
  }),
  answers: many(quizAnswers),
  userProgress: many(userLessonProgress),
}))

export const quizAnswers = mysqlTable('quiz_answer', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  lessonId: varchar('lesson_id', { length: 255 })
    .notNull()
    .references(() => lessons.id, {
      onDelete: 'cascade',
    }),
  content: varchar('content', { length: 255 }).notNull(),
  isCorrect: boolean('is_correct').notNull(),
  explanation: varchar('explanation', { length: 255 }),
})

export const userLessonProgress = mysqlTable(
  'user_lesson_progress',
  {
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    lessonId: varchar('lesson_id', { length: 255 })
      .notNull()
      .references(() => lessons.id, {
        onDelete: 'cascade',
      }),
    isCompleted: boolean('is_completed').default(false),
    date: timestamp('date', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
  },
  userLessonProgress => ({
    compositePk: primaryKey({
      columns: [userLessonProgress.userId, userLessonProgress.lessonId],
    }),
  })
)

export const purchases = mysqlTable('purchases', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  courseId: varchar('course_id', { length: 255 })
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
})

export const purchasesRelations = relations(purchases, ({ one }) => ({
  course: one(courses, {
    fields: [purchases.courseId],
    references: [courses.id],
  }),
}))

export const subscriptions = mysqlTable('subscription', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  subscriptionId: varchar('subscription_id', { length: 255 }).notNull(),
  customerId: varchar('customer_id', { length: 255 }).notNull(),
  priceId: varchar('price_id', { length: 255 }).notNull(),
  status: varchar('status', { length: 255 }).notNull(),
  currentPeriodEnd: timestamp('current_period_end', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: timestamp('updated_at', { mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
})

export const orders = mysqlTable('order', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  paymentId: varchar('payment_id', { length: 255 }).notNull(),
  customerId: varchar('customer_id', { length: 255 }).notNull(),
  totalAmount: int('total_amount').default(0).notNull(),
  status: varchar('status', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: timestamp('updated_at', { mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
})

export const reviews = mysqlTable(
  'review',
  {
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    courseId: varchar('course_id', { length: 255 })
      .notNull()
      .references(() => courses.id, {
        onDelete: 'cascade',
      }),
    rating: int('rating').notNull(),
    content: varchar('content', { length: 255 }),
    date: timestamp('date', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
  },
  reviews => ({
    compositePk: primaryKey({
      columns: [reviews.userId, reviews.courseId],
    }),
  })
)

export const insertReviewsSchema = createInsertSchema(reviews)

export const comments = mysqlTable('comment', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  courseId: varchar('course_id', { length: 255 })
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
  content: varchar('content', { length: 255 }),
  createdAt: timestamp('created_at', { mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
})

export const insertCommentsSchema = createInsertSchema(comments)

export const coupons = mysqlTable('coupon', {
  id: varchar('id', { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  code: varchar('code', { length: 255 }).notNull().unique(),
  discountType: varchar('discount_type', { length: 255 }).notNull(), // Loại giảm giá (ví dụ: 'percentage' hoặc 'fixed')
  discountValue: int('discount_value').notNull(),
  expires: timestamp('expires', { mode: 'date' }),
  isActive: boolean('is_active').default(true).notNull(),
})

export const carts = mysqlTable(
  'cart',
  {
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    courseId: varchar('course_id', { length: 255 })
      .notNull()
      .references(() => courses.id, {
        onDelete: 'cascade',
      }),
    date: timestamp('created_at', { mode: 'date' }),
  },
  carts => ({
    compositePk: primaryKey({
      columns: [carts.userId, carts.courseId],
    }),
  })
)

export const insertCartsSchema = createInsertSchema(carts)

export const wishlists = mysqlTable(
  'wishlist',
  {
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    courseId: varchar('course_id', { length: 255 })
      .notNull()
      .references(() => courses.id, {
        onDelete: 'cascade',
      }),
    date: timestamp('date', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
  },
  wishlists => ({
    compositePk: primaryKey({
      columns: [wishlists.userId, wishlists.courseId],
    }),
  })
)

export const insertWishlistsSchema = createInsertSchema(wishlists)
