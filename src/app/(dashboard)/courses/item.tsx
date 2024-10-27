import { BorderButton } from '@/components/custom/border-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WishlistButton } from '@/components/wishlist-button'
import { useCreateCart } from '@/features/carts/api/use-create-cart'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { MdStar, MdStarHalf } from 'react-icons/md'

type Props = {
  id: string
  title: string
  author: string
  imageUrl: string | null
  description: string | null
  price: number
  isInWishlist: boolean
  isInCart: boolean
}

export const Item = ({
  id,
  title,
  author,
  imageUrl,
  description,
  price,
  isInWishlist,
  isInCart,
}: Props) => {
  const { mutate: createCart, isPending: createCartLoading } = useCreateCart()

  const onCreateCart = () => {
    createCart({ courseId: id })
  }

  return (
    <Link key={id} href={`/courses/${id}`}>
      <Card
        key={id}
        className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
      >
        <div className="relative overflow-hidden">
          <Image
            src={imageUrl || '/placeholder.svg?height=400&width=600'}
            alt={title}
            width={0}
            height={0}
            sizes="100vw"
            className="aspect-video w-full object-cover transition ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 transition-all group-hover:opacity-100" />
          <div
            className={cn(
              'absolute right-2.5 top-2.5 rounded-full bg-white opacity-0 transition group-hover:opacity-100',
              isInWishlist && 'opacity-100'
            )}
          >
            <WishlistButton courseId={id} isInWishlist={isInWishlist} />
          </div>
        </div>
        <CardContent className="space-y-2 px-4 py-2 pb-4">
          <h3 className="line-clamp-2 text-lg font-bold text-gray-800">
            {title}
          </h3>
          <p className="mb-1 text-sm text-gray-600">{author}</p>
          <div className="flex items-center">
            <MdStar className="mr-1 size-4 fill-yellow-600 text-yellow-600" />
            <MdStar className="mr-1 size-4 fill-yellow-600 text-yellow-600" />
            <MdStar className="mr-1 size-4 fill-yellow-600 text-yellow-600" />
            <MdStar className="mr-1 size-4 fill-yellow-600 text-yellow-600" />
            <MdStarHalf className="mr-1 size-4 fill-yellow-600 text-yellow-600" />
            <span className="mr-2 text-sm font-medium text-gray-800">
              {4.7}
            </span>
            {/* <span className="text-sm text-gray-500">(0 students)</span> */}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {isInCart ? (
              <Link href="/cart">
                <Button className="bg-sky-100 text-sky-800 hover:bg-sky-50 hover:text-sky-800">
                  View cart
                </Button>
              </Link>
            ) : (
              <BorderButton
                onClick={onCreateCart}
                disabled={createCartLoading}
                label="Add to cart"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
