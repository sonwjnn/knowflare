import { Button } from '@/components/ui/button'
import { useCreateWishlist } from '@/features/wishlists/use-create-wishlist'
import { useDeleteWishlist } from '@/features/wishlists/use-delete-wishlist'
import { Heart } from 'lucide-react'

type Props = {
  courseId: string
  wishlistId: string | undefined
}

export const WishlistButton = ({ courseId, wishlistId }: Props) => {
  const { mutate: createWishlist, isPending: createWishlistLoading } =
    useCreateWishlist()
  const { mutate: deleteWishlist, isPending: deleteWishlistLoading } =
    useDeleteWishlist(wishlistId)

  const isPending = createWishlistLoading || deleteWishlistLoading

  const onClick = (e: any) => {
    e.preventDefault()

    if (wishlistId) {
      deleteWishlist()
    } else {
      createWishlist({ courseId })
    }
  }
  return (
    <Button
      onClick={onClick}
      disabled={isPending}
      size="icon"
      variant="ghost"
      className="rounded-full"
    >
      <Heart
        className={`h-4 w-4 ${wishlistId ? 'fill-red-500 text-red-500' : 'text-foreground'}`}
      />
    </Button>
  )
}
