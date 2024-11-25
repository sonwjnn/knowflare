import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useGetCarts } from '@/features/carts/api/use-get-carts'
import { useCartSheet } from '@/features/carts/store/use-cart-sheet'
import Link from 'next/link'

import { CartItem } from './cart-item'

export const CartSheet = () => {
  const { data: carts, isPending: cartsLoading } = useGetCarts()

  const [open, setOpen] = useCartSheet()

  const total =
    carts?.reduce((sum, item) => {
      if (!!item.discountPrice) {
        return sum + +item.discountPrice
      }
      return sum + item.price
    }, 0) || 0

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full space-y-4 p-0 md:w-[50%]">
        <SheetHeader className="border-default-100 flex flex-none flex-col items-start space-y-1 border-b px-6 py-4 text-center sm:text-left">
          <SheetTitle>
            Cart{' '}
            <span className="text-base font-semibold">
              ({(carts ?? []).length})
            </span>
          </SheetTitle>
          <SheetDescription>
            Total price: <span className="font-semibold">${total}</span>
          </SheetDescription>
        </SheetHeader>
        {!!carts?.length && (
          <>
            <ScrollArea className="h-[calc(100%-200px)] p-6">
              {carts?.map(item => (
                <CartItem
                  key={item.courseId}
                  id={item.courseId}
                  imageUrl={item.imageUrl}
                  title={item.title}
                  price={item.price}
                  discountPrice={
                    item.discountPrice ? +item.discountPrice : null
                  }
                />
              ))}
            </ScrollArea>
          </>
        )}
        {!carts?.length && (
          <div className="flex h-[calc(100%-200px)] items-center justify-center">
            <p>Your cart is empty.</p>
          </div>
        )}
        <div className="border-default-100 mt-auto border-t p-6">
          {!carts?.length ? (
            <Link href="/courses">
              <Button className="w-full">Explore Courses</Button>
            </Link>
          ) : (
            <Link href="/cart">
              <Button className="w-full">View cart</Button>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
