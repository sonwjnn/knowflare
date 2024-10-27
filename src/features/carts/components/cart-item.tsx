import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import Image from 'next/image'

import { useDeleteCart } from '../api/use-delete-cart'

type Props = {
  id: string
  imageUrl: string | null
  title: string
  price: number
}

export const CartItem = ({ id, imageUrl, title, price }: Props) => {
  const { mutate: deleteCart, isPending: deleteCartPending } = useDeleteCart(id)

  return (
    <div className="mb-4 flex items-center space-x-4">
      <div className="size-16">
        <Image
          src={imageUrl || ''}
          alt={title}
          width={0}
          height={0}
          sizes="100vw"
          className="h-full w-auto rounded-none object-cover"
        />
      </div>
      <div className="flex-1">
        <h5 className="font-medium">{title}</h5>
        <p className="text-sm text-muted-foreground">${price}</p>
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
