import { Button } from '@/components/ui/button'
import { useCreateCart } from '@/features/carts/use-create-cart'
import { useGetCartByCourseId } from '@/features/carts/use-get-cart-by-course-id'
import { useDeleteWishlist } from '@/features/wishlists/use-delete-wishlist'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Props = {
  courseId: string
  className?: string
}

export const CreateCartButton = ({ courseId, className }: Props) => {
  const router = useRouter()
  const { data: cart, isPending: cartLoading } = useGetCartByCourseId(courseId)
  const { mutate: createCart, isPending: createCartLoading } = useCreateCart()
  const { mutate: deleteWishlist, isPending: deleteWishlistLoading } =
    useDeleteWishlist(courseId)

  const isPending = cartLoading || createCartLoading || deleteWishlistLoading

  const onClick = (e: any) => {
    e.preventDefault()

    if (cart) {
      return router.push('/cart')
    }

    deleteWishlist()
    createCart({ courseId })
  }

  return (
    <Button
      disabled={isPending}
      className={cn('w-full', className)}
      onClick={onClick}
    >
      {cart ? 'Go to cart' : 'Add to cart'}
    </Button>
  )
}
