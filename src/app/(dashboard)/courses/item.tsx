import { BorderButton } from '@/components/custom/border-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WishlistButton } from '@/components/wishlist-button'
import { useCreateCart } from '@/features/carts/api/use-create-cart'
import { cn } from '@/lib/utils'
import { ChevronsUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { IoBook } from 'react-icons/io5'
import { MdStar } from 'react-icons/md'

type Props = {
  id: string
  title: string
  author: string
  imageUrl: string | null
  description: string | null
  price: number
  rating: number
  totalChapters: number
  isInWishlist: boolean
  isInCart: boolean
  isPurchased: boolean
}

export const Item = ({
  id,
  title,
  author,
  imageUrl,
  description,
  price,
  totalChapters,
  rating,
  isInWishlist,
  isInCart,
  isPurchased,
}: Props) => {
  const { mutate: createCart, isPending: createCartLoading } = useCreateCart()
  const [isAnimating, setIsAnimating] = useState(false)

  const onCreateCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAnimating(true)
    createCart({ courseId: id })

    setTimeout(() => setIsAnimating(false), 1000)
  }

  return (
    <Link key={id} href={`/courses/${id}`}>
      <Card className="group relative h-full overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
        {/* Image Course section - Redesigned */}
        <div className="relative overflow-hidden">
          <Image
            src={imageUrl!}
            alt={title}
            width={0}
            height={0}
            sizes="100vw"
            className={cn(
              'aspect-video w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105'
            )}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {!isPurchased && (
            <div className="absolute left-4 top-4 overflow-hidden rounded-2xl bg-white/95 shadow-lg backdrop-blur-md">
              <div className="relative px-4 py-2">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative z-10 text-base font-bold text-gray-900">
                  ${price.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        <CardContent className="space-y-2 p-4 pt-2">
          <div className="space-y-1">
            <h3 className="line-clamp-2 h-12 text-pretty bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-lg font-semibold leading-tight tracking-tight text-transparent">
              {title}
            </h3>
            <p className="flex items-center text-sm font-medium text-gray-600">
              <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/10">
                <svg
                  className="h-4 w-4 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              {author}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-2">
              <MdStar className="h-5 w-5 text-amber-500 transition-all duration-300 group-hover:text-amber-600" />
              <span className="ml-2 text-sm text-amber-700">
                {rating.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center rounded-2xl bg-sky-500/10 px-4 py-2 text-sky-500">
              <IoBook className="h-5 w-5 text-sky-700 transition-all duration-300 group-hover:text-sky-600" />
              <span className="ml-2 text-sm text-sky-700">
                {totalChapters} Lessons
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isPurchased && (
              <Button variant="success" size="lg" className="w-full">
                <ChevronsUp className="mr-2 size-5 text-white transition group-hover:rotate-90" />
                View Course
              </Button>
            )}
            {!isPurchased && (
              <>
                <div className="rounded-2xl bg-white/95 p-1 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-xl">
                  <WishlistButton courseId={id} isInWishlist={isInWishlist} />
                </div>
                {isInCart ? (
                  <Link
                    href="/cart"
                    className="flex-1"
                    onClick={e => e.stopPropagation()}
                  >
                    <Button
                      variant="success"
                      size="lg"
                      className="group/btn relative w-full overflow-hidden"
                    >
                      <span className="relative z-10 line-clamp-1 flex items-center justify-center gap-2">
                        <svg
                          className="h-5 w-5 transition-transform duration-300 group-hover/btn:-translate-y-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span className="truncate">View Cart</span>
                      </span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onCreateCart}
                    disabled={createCartLoading || isAnimating}
                    className={cn(
                      'group/btn relative flex-1 overflow-hidden',
                      isAnimating &&
                        'animate-[addToCart_1s_ease-in-out] bg-gradient-to-br from-emerald-500 to-teal-500'
                    )}
                  >
                    <span className="relative z-10 line-clamp-1 flex items-center justify-center gap-2">
                      <svg
                        className={cn(
                          'h-5 w-5 transition-all duration-300',
                          isAnimating
                            ? 'scale-110 animate-[spin_0.5s_ease-in-out]'
                            : 'group-hover/btn:rotate-12 group-hover/btn:scale-110'
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {isAnimating ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        )}
                      </svg>
                      <span className="truncate">
                        {isAnimating ? 'Added!' : 'Add to Cart'}
                      </span>
                    </span>

                    {isAnimating && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="absolute h-full w-full animate-[ripple_0.8s_ease-in-out] rounded-2xl bg-white opacity-20" />
                      </span>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
