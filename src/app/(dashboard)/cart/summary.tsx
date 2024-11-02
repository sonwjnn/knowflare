import { Button } from '@/components/ui/button'
import { useGetCarts } from '@/features/carts/api/use-get-carts'
import { useCheckout } from '@/features/subscriptions/api/use-checkout'
import { cn } from '@/lib/utils'
import { Lock, ShieldCheck } from 'lucide-react'
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
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-gray-900">
        Order Summary
      </h2>

      {/* Total Section with highlight */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-gray-900">
            ${total.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">USD</span>
        </div>
      </div>

      {/* Items count */}
      <div className="mt-4 text-sm text-gray-500">
        {carts?.length || 0} items in cart
      </div>

      {/* Checkout Button */}
      <Button
        variant="primary"
        className={cn('mt-6 w-full rounded-md')}
        size="lg"
        onClick={handleCheckout}
        disabled={checkoutLoading || cartsLoading || !carts?.length}
      >
        Proceed to Checkout
      </Button>

      {/* Security badges */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Lock className="size-4" />
          Secure checkout
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="size-4" />
          Money-back guarantee
        </div>
      </div>
    </div>
  )
}
