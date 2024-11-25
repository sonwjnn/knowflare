'use client'

import { UserButton } from '@/features/auth/components/user-button'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import SearchInput from './search-input'
import { Button } from './ui/button'

const NavbarRoutes = () => {
  const pathname = usePathname()

  const isCoursePage = pathname?.includes('/courses')
  const isSearchPage = pathname === '/search'

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="ml-auto flex gap-x-2">
        {isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </Link>
        ) : null}
        <UserButton />
      </div>
    </>
  )
}

export default NavbarRoutes
