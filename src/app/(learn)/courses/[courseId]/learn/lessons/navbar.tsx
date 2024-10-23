import Logo from '@/app/(dashboard)/logo'
import { Button } from '@/components/custom/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserButton } from '@/features/auth/components/user-button'
import { useCourseId } from '@/hooks/use-course-id'
import { Bell, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { MobileChaptersButton } from './[lessonId]/mobile-chapters-button'

export const Navbar = () => {
  const courseId = useCourseId()

  return (
    <header className="border-b border-gray-200 bg-white px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/courses/${courseId}`}>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Logo />
        </div>
        <div className="flex items-center space-x-4">
          <MobileChaptersButton />

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <UserButton />
        </div>
      </div>
    </header>
  )
}
