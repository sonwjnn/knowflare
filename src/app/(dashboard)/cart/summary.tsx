import { Button } from '@/components/ui/button'
import { useGetCarts } from '@/features/carts/use-get-carts'
import { useCheckout } from '@/features/subscriptions/api/use-checkout'
import Link from 'next/link'

export const Summary = () => {
  const { data: carts, isPending: cartsLoading } = useGetCarts()
  const { mutate: checkout, isPending: checkoutLoading } = useCheckout()

  const handleCheckout = () => {
    if (carts?.length === 0) return

    const courses = (carts ?? []).map(item => ({
      id: item.courseId,
      title: item.title,
      imageUrl: item.imageUrl,
      price: item.price,
    }))

    checkout({ courses })
  }

  const total = carts?.reduce((total, item) => total + item.price, 0) || 0

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
      <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <Button
        className="mt-6 w-full"
        size="lg"
        onClick={handleCheckout}
        disabled={checkoutLoading}
      >
        Checkout
      </Button>
    </div>
  )
}
