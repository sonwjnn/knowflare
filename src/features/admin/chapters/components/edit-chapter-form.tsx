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
import { useEditChapter } from '@/features/admin/chapters/api/use-edit-chapter'
import { useGetChapter } from '@/features/admin/chapters/api/use-get-chapter'
import { LessonsForm } from '@/features/admin/lessons/components/lessons-form'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useCourseId } from '@/hooks/use-course-id'
import { isEmptyHtml } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { EditToolbar } from './edit-toolbar'

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title is required and must be at least 2 characters long',
  }),
  description: z.string().optional(),
})

type FormValues = z.input<typeof formSchema>

export const EditChapterForm = () => {
  const courseId = useCourseId()
  const chapterId = useChapterId()

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

  if (!chapter) {
    return null
  }

  const requiredFields = [
    chapter.title,
    isEmptyHtml(chapter.description) ? '' : chapter.description,
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `${completedFields}/${totalFields}`

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-x-2">
          <h1 className="text-2xl font-medium">Chapter Creation</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
        <EditToolbar
          disabled={!isComplete}
          isPublished={!!chapter.isPublished}
        />
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
