import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import { BsDiscord } from 'react-icons/bs'

const avatarSizes = cva('', {
  variants: {
    size: {
      default: 'size-8',
      md: 'size-12',
      lg: 'size-14',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
  name: string
  imageUrl?: string
  className?: string
}

export const UserAvatar = ({
  name,
  imageUrl,
  size,
  className,
}: UserAvatarProps) => {
  return (
    <div
      className={cn('relative rounded-full', className, avatarSizes({ size }))}
    >
      <Avatar className={cn(avatarSizes({ size }))}>
        <AvatarImage src={imageUrl} className="object-cover" />
        <AvatarFallback className="bg-sky-500">
          <BsDiscord className="text-white" fontSize={18} />
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

interface UserAvatarSkeletonProps extends VariantProps<typeof avatarSizes> {}

export const UserAvatarSkeleton = ({ size }: UserAvatarSkeletonProps) => {
  return <Skeleton className={cn('rounded-full', avatarSizes({ size }))} />
}
