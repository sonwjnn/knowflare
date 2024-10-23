import { Button } from '@/components/ui/button'
import { useCreateWishlist } from '@/features/wishlists/api/use-create-wishlist'
import { useDeleteWishlist } from '@/features/wishlists/api/use-delete-wishlist'
import { Heart } from 'lucide-react'

type Props = {
  courseId: string
  isInWishlist: boolean
}

export const WishlistButton = ({ courseId, isInWishlist }: Props) => {
  const { mutate: createWishlist, isPending: createWishlistLoading } =
    useCreateWishlist()
  const { mutate: deleteWishlist, isPending: deleteWishlistLoading } =
    useDeleteWishlist(courseId)

  const isPending = createWishlistLoading || deleteWishlistLoading

  const onClick = (e: any) => {
    e.preventDefault()

    if (isInWishlist) {
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
        className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-foreground'}`}
      />
    </Button>
  )
}
