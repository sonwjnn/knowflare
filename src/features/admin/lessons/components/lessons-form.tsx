import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { insertCoursesSchema, lessons } from '@/db/schema'
import { useCreateLesson } from '@/features/admin/lessons/api/use-create-lesson'
import { useReorderLessons } from '@/features/admin/lessons/api/use-reorder-lessons'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useCourseId } from '@/hooks/use-course-id'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import LessonsList from './lessons-list'

const formSchema = insertCoursesSchema.pick({
  title: true,
})

type FormValues = z.input<typeof formSchema>

export const LessonsForm = () => {
  const courseId = useCourseId()
  const chapterId = useChapterId()

  const { mutate: createLesson, isPending: createLessonLoading } =
    useCreateLesson({ courseId, chapterId })
  const { mutate: reorderLesson, isPending: reorderLessonLoading } =
    useReorderLessons()

  const router = useRouter()

  const [isCreating, setIsCreating] = useState(false)

  const isLoading = createLessonLoading || reorderLessonLoading

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    createLesson(
      {
        ...values,
        courseId,
        chapterId,
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
    reorderLesson({
      list: updateData,
    })
  }

  const onEdit = async (id: string) => {
    router.push(
      `/admin/courses/edit/${courseId}/chapters/${chapterId}/lessons/${id}`
    )
  }

  return (
    <div className="relative mt-6 rounded-none border bg-slate-100 p-4">
      {isLoading && (
        <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded-none bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course lessons
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a lesson
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
            'mt-2 text-sm'
            // !lessons?.length && 'italic text-slate-500'
          )}
        >
          {/* {!lessons?.length && 'No lessons'} */}
          <LessonsList onEdit={onEdit} onReorder={onReorder} />
        </div>
      )}
      {!isCreating && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to reorder the lessons
        </p>
      )}
    </div>
  )
}
