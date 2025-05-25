'use client'

import SearchInput from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { UserButton } from '@/features/auth/components/user-button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { AnimatePresence, motion } from 'framer-motion'
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
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        shouldBeTransparent
          ? 'bg-transparent backdrop-blur-0'
          : 'bg-white/80 shadow-lg backdrop-blur-md'
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="flex h-20 items-center justify-between">
          {/* Left Section - Logo & Navigation */}
          <div className="flex items-center">
            <Logo />
            <div
              className={`ml-10 hidden items-center space-x-8 lg:flex ${
                shouldBeTransparent ? 'text-white' : 'text-gray-800'
              }`}
            >
              <Categories />
              <Link
                href="/about"
                className={`text-sm font-bold transition-all duration-300 hover:scale-105 ${
                  shouldBeTransparent
                    ? 'text-white/90 hover:text-white'
                    : 'text-gray-800 hover:text-primary'
                }`}
              >
                About
              </Link>
              <Link
                href="/blog"
                className={`text-sm font-bold transition-all duration-300 hover:scale-105 ${
                  shouldBeTransparent
                    ? 'text-white/90 hover:text-white'
                    : 'text-gray-800 hover:text-primary'
                }`}
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Right Section - Search, Cart & Auth */}
          <div className="hidden items-center space-x-6 lg:flex">
            <SearchInput
              className={`${
                shouldBeTransparent
                  ? 'text-white'
                  : 'text-gray-900 placeholder:text-gray-400'
              }`}
            />
            <Cart
              className={`transform transition-transform hover:scale-110 ${
                shouldBeTransparent ? 'text-white' : 'text-gray-900'
              }`}
            />
            {currentUser ? (
              <UserButton />
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`hidden font-medium sm:inline-flex ${
                      shouldBeTransparent
                        ? 'text-white hover:bg-white/10'
                        : 'text-gray-800 hover:bg-primary/5'
                    }`}
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className={`font-medium ${
                      shouldBeTransparent
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 lg:hidden">
            <SearchInput
              className={`${
                shouldBeTransparent ? 'text-white' : 'text-gray-900'
              }`}
            />
            <Cart
              className={`transform transition-transform hover:scale-110 ${
                shouldBeTransparent ? 'text-white' : 'text-gray-900'
              }`}
            />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`rounded-md p-2 ${
                shouldBeTransparent ? 'text-white' : 'text-gray-600'
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden"
            >
              <div className="fixed inset-0 top-20 bg-white/95 shadow-xl backdrop-blur-sm">
                <div className="flex flex-col space-y-4 p-6">
                  <Categories />
                  <Link
                    href="/about"
                    className="rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                  >
                    About
                  </Link>
                  {!currentUser && (
                    <div className="space-y-3 pt-4">
                      <Link href="/sign-in">
                        <Button
                          variant="ghost"
                          className="w-full justify-center"
                        >
                          Log In
                        </Button>
                      </Link>
                      <Link href="/sign-up">
                        <Button className="w-full justify-center">
                          Sign up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
