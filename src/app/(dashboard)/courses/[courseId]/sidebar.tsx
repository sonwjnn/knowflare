import { Button } from '@/components/ui/button'
import { useCreateCart } from '@/features/carts/api/use-create-cart'
import { useGetCartByCourseId } from '@/features/carts/api/use-get-cart-by-course-id'
import { useGetCurrentPurchase } from '@/features/purchases/api/use-get-current-purchases'
import { useCreateWishlist } from '@/features/wishlists/api/use-create-wishlist'
import { useDeleteWishlist } from '@/features/wishlists/api/use-delete-wishlist'
import { useGetWishlistByCourseId } from '@/features/wishlists/api/use-wishlist-cart-by-course-id'
import { useCourseId } from '@/hooks/use-course-id'
import { cn } from '@/lib/utils'
import {
  Award,
  Check,
  ChevronsRight,
  Clock,
  FileText,
  Play,
  ShoppingCart,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { GoHeartFill } from 'react-icons/go'

type Props = {
  imageUrl: string | undefined | null
  title: string | undefined
  price: number | undefined
  isPurchased: boolean
}

export const Sidebar = ({ imageUrl, title, price, isPurchased }: Props) => {
  const router = useRouter()

  const courseId = useCourseId()
  const { mutate: createCart, isPending: createCartLoading } = useCreateCart()

  const { data: cart, isPending: cartLoading } = useGetCartByCourseId(courseId)
  const { mutate: createWishlist, isPending: createWishlistLoading } =
    useCreateWishlist()
  const { data: wishlist, isPending: wishlistLoading } =
    useGetWishlistByCourseId(courseId)
  const { mutate: deleteWishlist, isPending: deleteWishlistLoading } =
    useDeleteWishlist(wishlist?.courseId)

  const isWishlistLoading =
    createWishlistLoading || wishlistLoading || deleteWishlistLoading
  const isCartLoading = createCartLoading || cartLoading
  const onClickCart = () => {
    if (cart) {
      router.push('/cart')
    } else {
      createCart({ courseId })
    }
  }

  const onClickWishlist = () => {
    if (wishlist) {
      deleteWishlist()
    } else {
      createWishlist({ courseId })
    }
  }

  const onBuyNow = () => {
    if (!cart) {
      createCart({ courseId })
    }

    router.push('/cart')
  }
  return (
    <div className="lg:w-[300px]">
      <div className="sticky top-24 space-y-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="relative aspect-video">
            <Image
              src={imageUrl!}
              alt={title!}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-3 py-1.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-white">
                <Play className="size-4" />
                <span className="text-sm font-medium">Preview Available</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="text-4xl font-bold text-gray-900">${price}</div>
                <div className="text-sm text-gray-500">
                  <s>${((price ?? 0) * 1.7).toFixed(2)}</s>
                  <span className="ml-2 text-green-600">70% off</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-red-600">
                <Clock className="size-4" />
                <span>Sale ends in 2 days</span>
              </div>
            </div>
            {isPurchased && (
              <Button
                variant="success"
                size="lg"
                onClick={() => router.push(`/courses/${courseId}/learn`)}
                className="w-full rounded-md"
              >
                Learn Course
                <ChevronsRight className="ml-1 size-5" />
              </Button>
            )}
            {!isPurchased && (
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onBuyNow}
                  className="w-full rounded-md"
                >
                  <ShoppingCart className="mr-2 size-5" />
                  Enroll Now
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 py-6 font-medium hover:bg-gray-50"
                    onClick={onClickCart}
                    disabled={isCartLoading}
                  >
                    {cart ? 'Go to Cart' : 'Add to Cart'}
                  </Button>

                  <Button
                    variant="outline"
                    className="aspect-square border-2 py-6"
                    onClick={onClickWishlist}
                    disabled={isWishlistLoading}
                  >
                    <GoHeartFill
                      className={cn(
                        'size-6 transition-all',
                        wishlist
                          ? 'scale-110 text-red-500'
                          : 'text-gray-400 hover:scale-110 hover:text-red-500'
                      )}
                    />
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4 rounded-xl bg-gray-50 p-5">
              <h4 className="font-medium text-gray-900">
                This course includes:
              </h4>
              <ul className="space-y-3">
                {[
                  {
                    icon: Play,
                    text: '12 hours on-demand video',
                    color: 'text-purple-600',
                    bg: 'bg-purple-50',
                  },
                  {
                    icon: FileText,
                    text: 'Downloadable resources',
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                  },
                  {
                    icon: Clock,
                    text: 'Lifetime access',
                    color: 'text-green-600',
                    bg: 'bg-green-50',
                  },
                  {
                    icon: Award,
                    text: 'Certificate of completion',
                    color: 'text-amber-600',
                    bg: 'bg-amber-50',
                  },
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className={cn('rounded-lg p-2', feature.bg)}>
                      <feature.icon className={cn('size-4', feature.color)} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Money Back Guarantee */}
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
              <div className="rounded-full bg-green-50 p-2 text-green-600">
                <Check className="size-5" />
              </div>
              <div className="space-y-0.5">
                <div className="font-medium text-gray-900">
                  30-Day Money-Back Guarantee
                </div>
                <div className="text-sm text-gray-500">
                  Full refund if you&apos;re not satisfied
                </div>
              </div>
            </div>

            {!isPurchased && (
              <div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push(`/courses/${courseId}/learn`)}
                  className="w-full"
                >
                  Try learn now
                  <ChevronsRight className="ml-1 size-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
