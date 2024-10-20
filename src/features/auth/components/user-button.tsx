'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useBilling } from '@/features/subscriptions/api/use-billing'
import {
  BookHeart,
  BrainCog,
  CreditCard,
  Loader,
  LogOut,
  TvMinimalPlay,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const UserButton = () => {
  const mutation = useBilling()
  const session = useSession()
  const router = useRouter()

  const onClick = () => {
    mutation.mutate()
  }

  if (session.status === 'loading') {
    return <Loader className="size-4 animate-spin text-muted-foreground" />
  }

  if (session.status === 'unauthenticated' || !session.data) {
    return null
  }

  const name = session.data?.user?.name!
  const imageUrl = session.data?.user?.image

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/* TODO: Add user crown if user is premium */}
        <Avatar className="size-10 cursor-pointer transition hover:opacity-75">
          <AvatarImage alt={name} src={imageUrl || ''} />
          <AvatarFallback className="flex items-center justify-center bg-blue-500 font-medium text-white">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        {/* {teacher && (
          <DropdownMenuItem
            className="h-10"
            onClick={() => router.push(`/teacher/${teacher.id}/courses`)}
            disabled={false}
          >
            <BrainCog className="mr-2 size-4" />
            Teacher Mode
          </DropdownMenuItem>
        )} */}
        <DropdownMenuItem
          className="h-10"
          onClick={() => router.push(`/my-courses`)}
          disabled={false}
        >
          <TvMinimalPlay className="mr-2 size-4" />
          My course
        </DropdownMenuItem>
        <DropdownMenuItem
          className="h-10"
          onClick={() => router.push(`/wishlist`)}
          disabled={false}
        >
          <BookHeart className="mr-2 size-4" />
          Wishlist
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10" onClick={onClick} disabled={false}>
          <CreditCard className="mr-2 size-4" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem
          className="h-10"
          onClick={() => signOut()}
          disabled={false}
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
