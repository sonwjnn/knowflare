import { Button } from '@/components/ui/button'
import { useGetCarts } from '@/features/carts/use-get-carts'
import { ChevronLeft, Loader, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

import { Item } from './item'

export const List = () => {
  const { data: carts, isPending: cartsLoading } = useGetCarts()

  if (cartsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!carts || carts?.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow">
        <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
        <p className="mb-4 text-gray-600">
          Looks like you haven&apos;t added any courses yet.
        </p>
        <Link href="/courses">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" /> Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      {carts?.map(item => (
        <Item
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          imageUrl={item.imageUrl}
          price={item.price}
        />
      ))}
    </div>
  )
}