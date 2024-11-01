import { z } from 'zod'

export const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  price: z.number(),
  level: z.string(),
  isPublished: z.boolean(),
  date: z.date(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  author: z.object({
    id: z.string(),
    name: z.string().nullable(),
  }),
})

export type Course = z.infer<typeof courseSchema>
