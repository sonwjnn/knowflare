import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCreateCart } from '@/features/carts/use-create-cart'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { WishlistButton } from './wishlist-button'

type Props = {
  id: string
  title: string
  imageUrl: string | null
  description: string | null
  price: number
  wishlistId: string | undefined
  cartId: string | undefined
}

export const Item = ({
  id,
  title,
  imageUrl,
  description,
  price,
  wishlistId,
  cartId,
}: Props) => {
  const { mutate: createCart, isPending: createCartLoading } = useCreateCart()

  const onCreateCart = (e: any) => {
    e.preventDefault()
    createCart({ courseId: id })
  }

  const isInCart = !!cartId

  return (
    <Link key={id} href={`/courses/${id}`}>
      <Card
        key={id}
        className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
      >
        <div className="relative">
          <Image
            src={imageUrl || '/placeholder.svg?height=400&width=600'}
            alt={title}
            width={0}
            height={0}
            sizes="100vw"
            className="h-48 w-full object-cover"
          />
          <div
            className={cn(
              'absolute right-2 top-2 rounded-full bg-white opacity-0 transition group-hover:opacity-100',
              !!wishlistId && 'opacity-100'
            )}
          >
            <WishlistButton courseId={id} wishlistId={wishlistId} />
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-800">
            {title}
          </h3>
          <p className="mb-4 text-sm text-gray-600">{description}</p>
          <div className="mb-4 flex items-center">
            <Star className="mr-1 h-5 w-5 text-yellow-400" />
            <span className="mr-2 text-sm font-medium text-gray-800">{5}</span>
            <span className="text-sm text-gray-500">(0 students)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {isInCart ? (
              <Link href="/cart">
                <Button>Go to cart</Button>
              </Link>
            ) : (
              <Button onClick={onCreateCart} disabled={createCartLoading}>
                Add to cart
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
