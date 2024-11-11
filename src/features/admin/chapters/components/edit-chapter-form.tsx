'use client'

import { RichEditor } from '@/components/custom/rich-editor'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useDeleteChapter } from '@/features/admin/chapters/api/use-delete-chapter'
import { useEditChapter } from '@/features/admin/chapters/api/use-edit-chapter'
import { useGetChapter } from '@/features/admin/chapters/api/use-get-chapter'
import { LessonsForm } from '@/features/admin/lessons/components/lessons-form'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useConfirm } from '@/hooks/use-confirm'
import { useCourseId } from '@/hooks/use-course-id'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title is required and must be at least 2 characters long',
  }),
  description: z.string().optional(),
})

type FormValues = z.input<typeof formSchema>

export const EditChapterForm = () => {
  const router = useRouter()
  const courseId = useCourseId()
  const chapterId = useChapterId()
  const [ComfirmDialog, confirm] = useConfirm(
    'Delete chapter',
    'Are you sure you want to delete this chapter?'
  )

  const { mutate: deleteChapter, isPending: deleteChapterLoading } =
    useDeleteChapter(chapterId)

  const onDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    deleteChapter(undefined, {
      onSuccess: () => {
        router.replace(`/admin/courses/edit/${courseId}`)
      },
    })
  }
  const { data: chapter, isPending: chapterLoading } = useGetChapter(chapterId)

  const { mutate: editChapter, isPending: editChapterLoading } =
    useEditChapter(chapterId)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: chapter?.title || '',
      description: chapter?.description || '',
    },
  })

  useEffect(() => {
    if (chapter) {
      form.setValue('title', chapter?.title || '')
      form.setValue('description', chapter?.description || '')
    }
  }, [chapter, form])

  const { isValid, isSubmitting } = form.formState

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    editChapter(values, { onSuccess: () => {} })
  }

  if (chapterLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <ComfirmDialog />
      <div className="mb-7 flex flex-col gap-2">
        <div className="ml-auto">
          {/* <PublishButton
            disabled={!isCompleted}
            courseId={course.id}
            isPublished={course.isPublished}
            page="Course"
          /> */}
          <Button disabled={deleteChapterLoading} onClick={onDelete}>
            Delete Chapter
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: Web Development for Beginners"
                    disabled={editChapterLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            disabled={editChapterLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RichEditor
                    {...field}
                    placeholder="What is this course about?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-5">
            <Link href={`/admin/courses/edit/${courseId}`}>
              <Button variant="outline" type="button">
                Back to Chapters
              </Button>
            </Link>
            <Button type="submit" disabled={editChapterLoading}>
              Save
            </Button>
          </div>
        </form>
      </Form>
      <LessonsForm />
    </>
  )
}
