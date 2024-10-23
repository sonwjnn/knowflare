import ChaptersList from '@/app/(dashboard)/teacher/[teacherId]/courses/[courseId]/chapters-list'
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
import { useCreateChapter } from '@/features/chapters/api/use-create-chapter'
import { useReorderChapters } from '@/features/chapters/api/use-reorder-chapters'
import { useTeacherId } from '@/hooks/use-teacher-id'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = insertCoursesSchema.pick({
  title: true,
})

type FormValues = z.input<typeof formSchema>

type ChaptersCourseFormProps = {
  initialData: (typeof chapters.$inferSelect)[]
  courseId: string
}

export const ChaptersCourseForm = ({
  initialData,
  courseId,
}: ChaptersCourseFormProps) => {
  const teacherId = useTeacherId()

  const { mutate: createChapter, isPending: createChapterLoading } =
    useCreateChapter(courseId)
  const { mutate: reorderChapters, isPending: reorderChaptersLoading } =
    useReorderChapters(courseId)

  const router = useRouter()

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
    router.push(`/teacher/${teacherId}/courses/${courseId}/chapters/${id}`)
  }

  return (
    <div className="relative mt-6 rounded-none border bg-slate-100 p-4">
      {isLoading && (
        <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded-none bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course Chapters
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder="e.g. 'Introduction to the course'"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            'mt-2 text-sm',
            !initialData?.length && 'italic text-slate-500'
          )}
        >
          {!initialData?.length && 'No chapters'}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData ?? []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  )
}
