import { Button } from '@/components/ui/button'
import { useCreateWishlist } from '@/features/wishlists/api/use-create-wishlist'
import { useDeleteWishlist } from '@/features/wishlists/api/use-delete-wishlist'
import { cn } from '@/lib/utils'
import { GoHeartFill } from 'react-icons/go'

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

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

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
      <GoHeartFill
        className={cn(
          `size-5 transition`,
          isInWishlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
        )}
      />
    </Button>
  )
}
