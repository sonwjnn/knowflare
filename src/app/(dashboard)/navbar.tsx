'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import SearchInput from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { UserButton } from '@/features/auth/components/user-button'
import { useCurrentUser } from '@/hooks/use-current-user'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      shouldBeTransparent ? 'bg-transparent' : 'bg-white shadow-md'
    }`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo className="h-8 w-auto" />
            <div className={`hidden md:block ml-10 ${shouldBeTransparent ? 'text-white' : 'text-gray-900'}`}>
              <Categories />
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <SearchInput className={shouldBeTransparent ? 'text-white' : 'text-gray-900'} />
            <Cart className={shouldBeTransparent ? 'text-white' : 'text-gray-900'} />
            {currentUser ? (
              <UserButton />
            ) : (
              <>
                <Link href="/sign-in">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`
                      ${shouldBeTransparent
                        ? 'text-white hover:text-white hover:bg-white/20'
                        : 'text-gray-700 hover:text-primary hover:bg-primary/10'
                      }
                      transition-colors duration-300
                    `}
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button 
                    size="sm" 
                    className={`
                      ${shouldBeTransparent
                        ? 'text-black hover:text-black bg-white hover:bg-white/20'
                        : 'text-white hover:text-primary-dark hover:bg-primary/10'
                      }
                      transition-colors duration-300
                    `}
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
                shouldBeTransparent ? 'text-white' : 'text-gray-600 hover:text-gray-900'
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
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Categories />
            <SearchInput />
            <Cart />
            {!currentUser && (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="w-full text-left">
                    Log In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="w-full bg-primary text-white hover:bg-primary-dark">
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
