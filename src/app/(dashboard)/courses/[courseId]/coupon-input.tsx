import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGetCoupon } from '@/features/coupons/api/use-get-coupon'
import { useGetCouponByCode } from '@/features/coupons/api/use-get-coupon-by-code'
import { useCourseId } from '@/hooks/use-course-id'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  code: string | null
}

export const CouponInput = ({ code }: Props) => {
  const courseId = useCourseId()
  const router = useRouter()
  const searchParams = useSearchParams()
  const couponId = searchParams.get('couponId') || ''

  const [coupon, setCoupon] = useState('')
  const [selectedCoupon, setSelectedCoupon] = useState(code || '')

  const { data, isPending } = useGetCouponByCode(selectedCoupon)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoupon(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSelectedCoupon(coupon)
  }

  useEffect(() => {
    if (!data) return

    if (couponId !== selectedCoupon) {
      router.replace(`/courses/${courseId}?couponId=${data.id}`)
    }
  }, [data, router, courseId, couponId, selectedCoupon])

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
        <Input
          placeholder="Enter coupon code"
          value={coupon}
          onChange={handleChange}
          className="w-full"
          required
          disabled={isPending}
        />
        {/* {errorMessage && (
          <div className="text-sm text-red-600">{errorMessage}</div>
        )} */}
        <Button disabled={isPending} type="submit" className="mt-2">
          Apply code
        </Button>
      </form>
    </div>
  )
}
