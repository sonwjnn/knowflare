'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useBilling } from '@/features/subscriptions/api/use-billing'
import {
  BookHeart,
  BrainCog,
  CreditCard,
  Loader2,
  LogOut,
  TvMinimalPlay,
  UserCircle,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const UserButton = () => {
  const mutation = useBilling()
  const session = useSession()
  const router = useRouter()

  const onClick = () => {
    mutation.mutate()
  }

  if (session.status === 'loading') {
    return <Loader2 className="size-4 animate-spin text-muted-foreground" />
  }

  if (session.status === 'unauthenticated' || !session.data) {
    return null
  }

  const name = session.data?.user?.name || ''
  const email = session.data?.user?.email || ''
  const imageUrl = session.data?.user?.image || ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="size-10 cursor-pointer ring-2 ring-offset-2 ring-offset-background transition hover:ring-primary">
          <AvatarImage alt={name} src={imageUrl || ''} />
          <AvatarFallback className="flex items-center justify-center bg-sky-500 font-medium text-white">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="space-y-1">
          <Link href="/my-profile">
            <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
              <UserCircle className="size-4" />
              My Profile
            </DropdownMenuItem>
          </Link>
          <Link href="/my-courses">
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
              onClick={() => router.push(`/my-courses`)}
            >
              <TvMinimalPlay className="size-4" />
              My Courses
            </DropdownMenuItem>
          </Link>
          <Link href="/wishlist">
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
              onClick={() => router.push(`/wishlist`)}
            >
              <BookHeart className="size-4" />
              Wishlist
            </DropdownMenuItem>
          </Link>
        </div>
        <DropdownMenuSeparator />
        <div className="space-y-1">
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
            onClick={onClick}
          >
            <CreditCard className="size-4" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-700"
            onClick={() => signOut()}
          >
            <LogOut className="size-4" />
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
