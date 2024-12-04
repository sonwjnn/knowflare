'use client'

import SearchInput from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { UserButton } from '@/features/auth/components/user-button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Cart } from './cart'
import { Categories } from './categories'
import Logo from './logo'

const Navbar = () => {
  const currentUser = useCurrentUser()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isHomePage = pathname === '/'
  const shouldBeTransparent = isHomePage && !isScrolled

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        shouldBeTransparent ? 'bg-transparent' : 'bg-white shadow-md'
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Logo />
            <div
              className={`ml-10 hidden md:block ${shouldBeTransparent ? 'text-white' : 'text-gray-900'}`}
            >
              <Categories />
            </div>
          </div>
          <div className="hidden items-center space-x-4 md:flex">
            <Link
              href="/about"
              className={`hover:opacity-80 transition-opacity ${
                shouldBeTransparent ? 'text-white' : 'text-gray-900'
              }`}
            >
              About
            </Link>
            <SearchInput
              className={shouldBeTransparent ? 'text-white' : 'text-gray-900'}
            />
            <Cart
              className={shouldBeTransparent ? 'text-white' : 'text-gray-900'}
            />
            {currentUser ? (
              <UserButton />
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={` ${
                      shouldBeTransparent
                        ? 'text-white hover:bg-white/20 hover:text-white'
                        : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                    } transition-colors duration-300`}
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className={` ${
                      shouldBeTransparent
                        ? 'bg-white text-black hover:bg-white/20 hover:text-black'
                        : 'hover:text-primary-dark text-white hover:bg-primary/10'
                    } transition-colors duration-300`}
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`focus:outline-none ${
                shouldBeTransparent
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="bg-white shadow-lg md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Categories />
            <SearchInput />
            <Link href="/about">
              <div className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50">
                About
              </div>
            </Link>
            <Cart />
            {!currentUser && (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-left"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className="hover:bg-primary-dark w-full bg-primary text-white"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
