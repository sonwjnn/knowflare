import { z } from 'zod'

export const couponSchema = z.object({
  id: z.string(),
  discountAmount: z.number(),
  code: z.string(),
  expires: z.date(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  isActive: z.boolean(),
})

export type Coupon = z.infer<typeof couponSchema>
