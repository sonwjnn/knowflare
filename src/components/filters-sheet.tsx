import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCoursesFilterStore } from '@/store/use-course-filter'

import { CourseSidebar } from './courses-sidebar'

export const FiltersSheet = () => {
  const [open, setOpen] = useCoursesFilterStore()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full space-y-4 p-2 md:w-[50%]">
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 p-4">
            <SheetTitle>Courses Filter</SheetTitle>
          </div>
          <ScrollArea className="flex-1">
            <CourseSidebar />
          </ScrollArea>
        </div>
        <SheetDescription></SheetDescription>
      </SheetContent>
    </Sheet>
  )
}
