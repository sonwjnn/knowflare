import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

import CourseSidebar from './sidebar'

export const CourseMobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-white p-0">
        <CourseSidebar />
      </SheetContent>
    </Sheet>
  )
}
