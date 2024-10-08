'use client'

import NavbarRoutes from '@/components/navbar-routes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserButton } from '@/features/auth/components/user-button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { ChevronDown, Search } from 'lucide-react'
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
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-700">
              Knowflare
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
          <div className="flex items-center">
            <div className="mr-4 hidden md:block">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="What do you want to learn?"
                  className="w-64 pl-10"
                />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              </div>
            </div>
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
            <div className="ml-3">
              <Cart />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
