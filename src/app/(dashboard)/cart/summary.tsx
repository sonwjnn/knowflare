import { Button } from '@/components/ui/button'
import { useGetCarts } from '@/features/carts/use-get-carts'
import Link from 'next/link'

export const Summary = () => {
  const { data: carts, isPending: cartsLoading } = useGetCarts()

  const subtotal = carts?.reduce((total, item) => total + item.price, 0) || 0

  const tax = subtotal * 0.1
  const total = subtotal + tax
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
      <div className="mb-2 flex justify-between">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="mb-2 flex justify-between">
        <span>Estimated Tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <Link href="/payment/checkout">
        <Button className="mt-6 w-full" size="lg">
          Checkout
        </Button>
      </Link>
    </div>
  )
}