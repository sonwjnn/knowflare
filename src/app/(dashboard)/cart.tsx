import { useGetCarts } from '@/features/carts/api/use-get-carts'
import { useCartSheet } from '@/features/carts/store/use-cart-sheet'
import { cn } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'

export const Cart = ({ className }: { className?: string }) => {
  const { data: carts, isPending: cartsLoading } = useGetCarts()

  const [open, setOpen] = useCartSheet()

  return (
    <div
      className={cn(
        'group relative border-none bg-transparent p-2 hover:bg-transparent',
        className
      )}
      onClick={() => setOpen(true)}
    >
      <ShoppingCart
        className={cn(
          'size-5',
          open && 'text-blue-500 transition-colors',
          className
        )}
      />
      {!cartsLoading && (
        <span className="absolute -right-1 top-0 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {(carts ?? []).length || 0}
        </span>
      )}
    </div>
  )
}
