import { useParams } from 'next/navigation'

export const useCouponId = () => {
  const params = useParams()

  return params.couponId as string
}
