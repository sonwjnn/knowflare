import { Sheet, SheetContent, SheetDescription } from '@/components/ui/sheet'
import { insertChaptersSchema } from '@/db/schema'
import { useChaptersSheet } from '@/features/chapters/store/use-chapters-sheet'
import { useEffect } from 'react'
import { useMedia } from 'react-use'

import { ChaptersList } from './chapters-list'

type ChaptersSheetProps = {}

const chapters = [
  { id: 1, title: 'Introduction', lessons: 3, duration: '07:28' },
  {
    id: 2,
    title: 'Variables, comments, built-in',
    lessons: 10,
    duration: '30:51',
  },
  { id: 3, title: 'Data types', lessons: 26, duration: '01:51:16' },
  { id: 4, title: 'Working with functions', lessons: 15, duration: '53:57' },
  { id: 5, title: 'Working with strings', lessons: 6, duration: '41:21' },
  { id: 6, title: 'Working with numbers', lessons: 5, duration: '26:10' },
  { id: 7, title: 'Working with arrays', lessons: 7, duration: '44:07' },
  { id: 8, title: 'Working with objects', lessons: 10, duration: '01:14:26' },
  { id: 9, title: 'Conditional statements', lessons: 7, duration: '33:12' },
  { id: 10, title: 'Loops', lessons: 16, duration: '01:43:18' },
  {
    id: 11,
    title: 'Advanced array methods',
    lessons: 11,
    duration: '02:06:43',
  },
  { id: 12, title: 'Callbacks', lessons: 12, duration: '01:26:30' },
]

const formSchema = insertChaptersSchema.omit({
  id: true,
})

export const ChaptersSheet = ({}: ChaptersSheetProps) => {
  const isMobile = useMedia('(max-width: 1024px)', false)

  const [open, setOpen] = useChaptersSheet()

  useEffect(() => {
    if (!isMobile && open) {
      setOpen(false)
    }
  }, [isMobile, setOpen, open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full space-y-4 p-2 md:w-[50%]">
        <ChaptersList />
        <SheetDescription></SheetDescription>
      </SheetContent>
    </Sheet>
  )
}
