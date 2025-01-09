import { relations } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import type { AdapterAccountType } from 'next-auth/adapters'
import { z } from 'zod'

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  TEACHER = 'teacher',
}

export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any
}

export const roleEnum = pgEnum('role', enumToPgEnum(UserRole))

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  role: roleEnum('role').default(UserRole.USER).notNull(),
  image: text('image'),
  password: text('password'),
  bio: text('bio'),
  fullName: text('full_name'),
  isTwoFactorEnabled: boolean('is_two_factor_enabled').default(false).notNull(),
})

export const insertUsersSchema = createInsertSchema(users)

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verification_token',
  {
    email: text('email').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  verificationToken => ({
    compositePk: primaryKey({
      columns: [verificationToken.email, verificationToken.token],
    }),
  })
)

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  authenticator => ({
    compositePk: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)

export const passwordResetTokens = pgTable(
  'password_reset_token',
  {
    email: text('email').notNull(),
    token: text('token').notNull().unique(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  passwordResetTokens => ({
    compositePk: primaryKey({
      columns: [passwordResetTokens.email, passwordResetTokens.token],
    }),
  })
)

export const twoFactorTokens = pgTable(
  'two_factor_token',
  {
    email: text('email').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  twoFactorToken => ({
    compositePk: primaryKey({
      columns: [twoFactorToken.email, twoFactorToken.token],
    }),
  })
)

export const twoFactorConfirmations = pgTable('two_factor_confirmation', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
})

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ALL_LEVEL = 'all level',
}

export const levelEnum = pgEnum('level', enumToPgEnum(CourseLevel))

export const courses = pgTable('course', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  categoryId: text('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
  level: levelEnum('level').default(CourseLevel.ALL_LEVEL).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  price: integer('price').default(0).notNull(),
  avgRating: real('avg_rating').default(0).notNull(),
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

export const categories = pgTable('category', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
})

export const insertCategoriesSchema = createInsertSchema(categories)

export const attachments = pgTable('attachment', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text('course_id')
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
  name: text('name').notNull(),
  url: text('url').notNull(),
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

export const chapters = pgTable('chapter', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text('course_id')
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
  title: text('title').notNull(),
  description: text('description'),
  position: integer('position').notNull(),
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

export const lessonTypeEnum = pgEnum('lesson_type', enumToPgEnum(LessonType))

export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
}

export const questionTypeEnum = pgEnum(
  'question_type',
  enumToPgEnum(QuestionType)
)

export const lessons = pgTable('lesson', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text('course_id')
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
  chapterId: text('chapter_id')
    .notNull()
    .references(() => chapters.id, {
      onDelete: 'cascade',
    }),
  title: text('title').notNull(),
  description: text('description'),
  lessonType: lessonTypeEnum('lesson_type').default(LessonType.VIDEO).notNull(),
  position: integer('position').notNull(),
  isPublished: boolean('is_published').default(false),
  isFree: boolean('is_free').default(false),

  videoUrl: text('video_url'),
  duration: integer('duration'),

  question: text('question'),
  questionType: questionTypeEnum('question_type'),
})

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [lessons.chapterId],
    references: [chapters.id],
  }),
  answers: many(quizAnswers),
  userProgress: many(userLessonProgress),
}))

export const insertLessonsSchema = createInsertSchema(lessons)

export const quizAnswers = pgTable('quiz_answer', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  lessonId: text('lesson_id')
    .notNull()
    .references(() => lessons.id, {
      onDelete: 'cascade',
    }),
  content: text('content').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  explanation: text('explanation'),
})

export const userLessonProgress = pgTable(
  'user_lesson_progress',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    lessonId: text('lesson_id')
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

export const purchases = pgTable('purchases', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  courseId: text('course_id')
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
  date: timestamp('date', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
})

export const purchasesRelations = relations(purchases, ({ one }) => ({
  course: one(courses, {
    fields: [purchases.courseId],
    references: [courses.id],
  }),
}))

export const subscriptions = pgTable('subscription', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  subscriptionId: text('subscription_id').notNull(),
  customerId: text('customer_id').notNull(),
  priceId: text('price_id').notNull(),
  status: text('status').notNull(),
  currentPeriodEnd: timestamp('current_period_end', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: timestamp('updated_at', { mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
})

export const orders = pgTable('order', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  paymentId: text('payment_id').notNull(),
  customerId: text('customer_id').notNull(),
  totalAmount: integer('total_amount').default(0).notNull(),
  status: text('status'),
  createdAt: timestamp('created_at', { mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updatedAt: timestamp('updated_at', { mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
})

export const reviews = pgTable(
  'review',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    courseId: text('course_id')
      .notNull()
      .references(() => courses.id, {
        onDelete: 'cascade',
      }),
    rating: integer('rating').notNull(),
    content: text('content'),
    date: timestamp('date', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
  },
  reviews => ({
    compositePk: primaryKey({
      columns: [reviews.userId, reviews.courseId],
    }),
  })
)

export const insertReviewsSchema = createInsertSchema(reviews)

export const comments = pgTable('comment', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  courseId: text('course_id')
    .notNull()
    .references(() => courses.id, {
      onDelete: 'cascade',
    }),
  content: text('content'),
  createdAt: timestamp('created_at', { mode: 'date' }).default(
    sql`CURRENT_TIMESTAMP`
  ),
})

export const insertCommentsSchema = createInsertSchema(comments)

export enum CouponType {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export const couponTypeEnum = pgEnum('coupon_type', enumToPgEnum(CouponType))

export const coupons = pgTable('coupon', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  categoryId: text('category_id').references(() => categories.id, {
    onDelete: 'cascade',
  }),
  code: text('code').notNull().unique(),
  discountAmount: integer('discount_amount').notNull(),
  expires: timestamp('expires', { mode: 'date' }),
  type: couponTypeEnum('coupon_type').default(CouponType.PUBLIC).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
})

export const insertCouponsSchema = createInsertSchema(coupons)

export const carts = pgTable(
  'cart',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    courseId: text('course_id')
      .notNull()
      .references(() => courses.id, {
        onDelete: 'cascade',
      }),
    couponId: text('coupon_id').references(() => coupons.id, {
      onDelete: 'set null',
    }),
    date: timestamp('date', { mode: 'date' }),
  },
  carts => ({
    compositePk: primaryKey({
      columns: [carts.userId, carts.courseId],
    }),
  })
)

export const insertCartsSchema = createInsertSchema(carts)

export const wishlists = pgTable(
  'wishlist',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
    courseId: text('course_id')
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

export const backups = pgTable('backup', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fileUrl: text('file_url').notNull().unique(),
  date: timestamp('date', { mode: 'date' }).default(sql`CURRENT_TIMESTAMP`),
})

export const insertBackupsSchema = createInsertSchema(backups)
