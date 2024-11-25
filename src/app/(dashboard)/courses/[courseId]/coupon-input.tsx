import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGetCoupon } from '@/features/coupons/api/use-get-coupon'
import { useGetCouponByCode } from '@/features/coupons/api/use-get-coupon-by-code'
import { useCourseId } from '@/hooks/use-course-id'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  code: string | null
  categoryId: string
}

export const CouponInput = ({ code, categoryId }: Props) => {
  const courseId = useCourseId()
  const router = useRouter()
  const searchParams = useSearchParams()
  const couponId = searchParams.get('couponId') || ''

  const [coupon, setCoupon] = useState('')

  const { mutate: getCoupon, isPending } = useGetCouponByCode()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoupon(e.target.value)
  }

  const onApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    getCoupon(
      {
        code: coupon,
        categoryId,
      },
      {
        onSuccess: ({ data }) => {
          console.log(data.id)
          router.replace(`/courses/${courseId}?couponId=${data.id}`)
        },
      }
    )
  }

  return (
    <div className="mt-4">
      <form onSubmit={onApply} className="relative">
        <Input
          placeholder="Enter coupon code"
          value={coupon}
          onChange={handleChange}
          className="h-10 pr-24"
          required
          disabled={isPending}
        />
        {/* {errorMessage && (
          <div className="text-sm text-red-600">{errorMessage}</div>
        )} */}
        <div className="absolute right-0 top-0">
          <Button
            disabled={isPending}
            type="submit"
            className="m-1.5 h-7 rounded-md text-xs"
          >
            Apply
          </Button>
        </div>
      </form>
    </div>
  )
}
