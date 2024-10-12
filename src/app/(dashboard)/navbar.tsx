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
import MobileSidebar from './mobile-sidebar'

const Navbar = () => {
  const currentUser = useCurrentUser()

  return (
    // <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
    //   <MobileSidebar />
    //   <NavbarRoutes />
    // </div>
    <nav className="bg-[#2d2f31] shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" width={60} height={60} alt="Logo" />
              <h3 className="text-2xl font-bold text-slate-300">Knowflare</h3>
            </Link>
            <Categories />
          </div>
          <div className="flex items-center gap-x-3">
            <div className="hidden md:block">
              <SearchInput />
            </div>
            <Cart />
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
