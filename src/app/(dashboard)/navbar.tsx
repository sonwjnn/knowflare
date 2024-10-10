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
            {/* <nav className="ml-10 hidden space-x-8 md:flex">
              <div className="group relative">
                <button className="flex items-center text-gray-500 hover:text-gray-900">
                  Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="invisible absolute left-0 z-10 mt-2 w-56 rounded-md bg-white opacity-0 shadow-lg ring-1 ring-black ring-opacity-5 transition duration-100 ease-out group-hover:visible group-hover:opacity-100">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    {categories.map(category => (
                      <a
                        key={category}
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        {category}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </nav> */}
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
                  <Button variant="ghost">Log In</Button>
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
