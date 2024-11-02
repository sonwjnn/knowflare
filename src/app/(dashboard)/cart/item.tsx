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
    <div className="group relative flex gap-6 border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
      {/* Image container with overlay effect */}
      <div className="relative aspect-[4/3] w-[120px] overflow-hidden rounded-lg sm:w-[180px]">
        <Image
          src={imageUrl!}
          alt={title}
          width={180}
          height={135}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">
              In Cart
            </span>
          </div>

          <Button
            size="icon"
            onClick={() => deleteCart()}
            className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
            disabled={deleteCartLoading}
          >
            <Trash2 className="size-4" />
            {deleteCartLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
