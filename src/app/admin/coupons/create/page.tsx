'use client'

import { CreateCouponForm } from '@/features/admin/coupons/components/create-coupon-form'

export default function CreateCoupon() {
  return (
    <div className="container mx-auto flex-grow px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <CreateCouponForm />
      </div>
    </div>
  )
}
