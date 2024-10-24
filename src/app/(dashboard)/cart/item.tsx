import { Button } from '@/components/ui/button'
import { useDeleteCart } from '@/features/carts/api/use-delete-cart'
import { Trash, Trash2 } from 'lucide-react'
import Image from 'next/image'

type Props = {
  courseId: string
  title: string
  imageUrl: string | null
  description: string | null
  price: number
}

export const Item = ({
  courseId,
  title,
  imageUrl,
  description,
  price,
}: Props) => {
  const { mutate: deleteCart, isPending: deleteCartLoading } =
    useDeleteCart(courseId)

  return (
    <div
      key={courseId}
      className="flex items-center border-b border-gray-200 p-6"
    >
      <Image
        src={imageUrl!}
        alt={title}
        width={120}
        height={80}
        className="mr-6 aspect-video rounded-none object-cover"
      />
      <div className="flex-grow">
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        <p className="mb-2 text-sm text-gray-600">{description}</p>
      </div>
      <div className="text-right">
        <p className="mb-2 text-lg font-semibold">${price.toFixed(2)}</p>

        <Button
          size="icon"
          onClick={() => deleteCart()}
          className="rounded-full bg-slate-200 text-muted-foreground hover:bg-rose-500 hover:text-white"
          disabled={deleteCartLoading}
        >
          <Trash className="size-4" />
        </Button>
      </div>
    </div>
  )
}
