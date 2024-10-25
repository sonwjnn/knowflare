import { BorderButton } from '@/components/custom/border-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCreateCart } from '@/features/carts/api/use-create-cart'
import { cn } from '@/lib/utils'
import { Eye, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { WishlistButton } from '../../../components/wishlist-button'

type Props = {
  id: string
  title: string
  imageUrl: string | null
  description: string | null
  price: number
  isInWishlist: boolean
  isInCart: boolean
}

export const Item = ({
  id,
  title,
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
          <div
            className={cn(
              'absolute right-2.5 top-2.5 rounded-full bg-white opacity-0 transition group-hover:opacity-100',
              isInWishlist && 'opacity-100'
            )}
          >
            <WishlistButton courseId={id} isInWishlist={isInWishlist} />
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-800">
            {title}
          </h3>
          <p className="mb-4 text-sm text-gray-600">{description}</p>
          <div className="mb-4 flex items-center">
            <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="mr-2 text-sm font-medium text-gray-800">{5}</span>
            <span className="text-sm text-gray-500">(0 students)</span>
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
