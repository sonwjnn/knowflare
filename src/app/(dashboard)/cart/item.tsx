import { Button } from '@/components/ui/button'
import { useDeleteCart } from '@/features/carts/use-delete-cart'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'

type Props = {
  id: string
  title: string
  imageUrl: string | null
  description: string | null
  price: number
}

export const Item = ({ id, title, imageUrl, description, price }: Props) => {
  const { mutate: deleteCart, isPending: deleteCartLoading } = useDeleteCart(id)

  const onRemove = () => {
    deleteCart()
  }

  return (
    <div key={id} className="flex items-center border-b border-gray-200 p-6">
      <Image
        src={imageUrl!}
        alt={title}
        width={120}
        height={80}
        className="mr-6 aspect-video rounded-lg object-cover"
      />
      <div className="flex-grow">
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        <p className="mb-2 text-sm text-gray-600">{description}</p>
      </div>
      <div className="text-right">
        <p className="mb-2 text-lg font-semibold">${price.toFixed(2)}</p>
        <Button
          disabled={deleteCartLoading}
          variant="ghost"
          size="sm"
          onClick={onRemove}
        >
          <Trash2 className="size-4 text-rose-500" />
        </Button>
      </div>
    </div>
  )
}
