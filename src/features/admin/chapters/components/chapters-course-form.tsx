import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { chapters, insertCoursesSchema } from '@/db/schema'
import { useCreateChapter } from '@/features/admin/chapters/api/use-create-chapter'
import { useReorderChapters } from '@/features/admin/chapters/api/use-reorder-chapters'
import { useCreateChapterModal } from '@/features/admin/chapters/store/use-create-chapter-modal'
import { useCourseId } from '@/hooks/use-course-id'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import ChaptersList from './chapters-list'

const formSchema = insertCoursesSchema.pick({
  title: true,
})

type FormValues = z.input<typeof formSchema>

export const ChaptersCourseForm = () => {
  const courseId = useCourseId()
  const router = useRouter()

  const { mutate: createChapter, isPending: createChapterLoading } =
    useCreateChapter(courseId)
  const { mutate: reorderChapters, isPending: reorderChaptersLoading } =
    useReorderChapters(courseId)

  const [open, setOpen] = useCreateChapterModal()

  const [isCreating, setIsCreating] = useState(false)

  const isLoading = createChapterLoading || reorderChaptersLoading

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    createChapter(
      {
        ...values,
        courseId,
      },
      {
        onSuccess: () => {
          toggleCreating()
        },
      }
    )
  }

  const toggleCreating = () => {
    setIsCreating(current => !current)
  }

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    reorderChapters({
      list: updateData,
    })
  }

  const onEdit = async (id: string) => {
    router.push(`/admin/courses/edit/${courseId}/chapters/${id}`)
  }

  return (
    <div className="relative mt-6 rounded-none border bg-slate-100 p-4">
      {isLoading && (
        <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded-none bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course chapters
        <Button onClick={() => setOpen(true)} variant="ghost" type="button">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add a chapter
        </Button>
      </div>

      <div
        className={cn(
          'mt-2 text-sm'
          // !chapters?.length && 'italic text-slate-500'
        )}
      >
        {/* {!chapters?.length && 'No chapters'} */}
        <ChaptersList onEdit={onEdit} onReorder={onReorder} />
      </div>
      {!isCreating && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  )
}
