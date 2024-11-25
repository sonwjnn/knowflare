import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import Image from 'next/image'

import { useDeleteCart } from '../api/use-delete-cart'

type Props = {
  id: string
  imageUrl: string | null
  title: string
  price: number
  discountPrice?: number | null
}

export const CartItem = ({
  id,
  imageUrl,
  title,
  price,
  discountPrice,
}: Props) => {
  const { mutate: deleteCart, isPending: deleteCartPending } = useDeleteCart(id)

  const hasDiscount = !!discountPrice

  return (
    <div className="mb-4 flex items-center space-x-4">
      <div className="size-16">
        <Image
          src={imageUrl || ''}
          alt={title}
          width={0}
          height={0}
          sizes="100vw"
          className="h-full w-auto rounded-md object-cover"
        />
      </div>
      <div className="flex-1">
        <h5 className="font-medium">{title}</h5>
        {!hasDiscount && (
          <span className="text-sm font-semibold">${price.toFixed(2)}</span>
        )}

        {hasDiscount && (
          <>
            <span className="mr-1 text-xs text-gray-500 line-through">
              ${price.toFixed(2)}
            </span>

            <span className="text-sm font-semibold">
              ${discountPrice.toFixed(2)}
            </span>
          </>
        )}
      </div>
      <Button
        size="icon"
        onClick={() => deleteCart()}
        className="rounded-full bg-slate-200 text-muted-foreground hover:bg-rose-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-2"
        disabled={deleteCartPending}
      >
        <Trash className="size-4" />
      </Button>
    </div>
  )
}
