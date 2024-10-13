'use client'

import NavbarRoutes from '@/components/navbar-routes'
import SearchInput from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserButton } from '@/features/auth/components/user-button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { ChevronDown, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Cart } from './cart'
import { Categories } from './categories'
import Logo from './logo'
import MobileSidebar from './mobile-sidebar'
import { Wishlist } from './wishlist'

const Navbar = () => {
  const currentUser = useCurrentUser()

  return (
    <nav className="border border-b-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Logo />
            <Categories />
          </div>
          <div className="flex items-center gap-x-4">
            <div className="hidden md:block">
              <SearchInput />
            </div>
            <Cart />
            <Wishlist />
            {currentUser ? (
              <UserButton />
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-transparent hover:text-white"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
