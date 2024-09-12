import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

import Sidebar from './sidebar'

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="bg-white p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
