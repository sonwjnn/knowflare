'use client'

import { UserButton } from '@/features/auth/components/user-button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { isTeacher } from '@/lib/utils'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import SearchInput from './search-input'
import { Button } from './ui/button'

const NavbarRoutes = () => {
  const currentUser = useCurrentUser()
  const pathname = usePathname()

  const isTeacherPage = pathname?.startsWith('/teacher')
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
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </Link>
        ) : isTeacher(currentUser?.id) ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher Mode
            </Button>
          </Link>
        ) : null}
        <UserButton />
      </div>
    </>
  )
}

export default NavbarRoutes