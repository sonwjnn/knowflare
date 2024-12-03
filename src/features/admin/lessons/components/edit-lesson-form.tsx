'use client'

import { FileUpload } from '@/components/custom//file-upload'
import { RichEditor } from '@/components/custom/rich-editor'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useDeleteLesson } from '@/features/admin/lessons//api/use-delete-lesson'
import { useEditLesson } from '@/features/admin/lessons/api/use-edit-lesson'
import { useGetLesson } from '@/features/admin/lessons/api/use-get-lesson'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useConfirm } from '@/hooks/use-confirm'
import { useCourseId } from '@/hooks/use-course-id'
import { useLessonId } from '@/hooks/use-lesson-id'
import { isEmptyHtml } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { EditToolbar } from './edit-toolbar'
import { VideoForm } from './video-form'

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Title is required and must be at least 2 characters long',
    })
    .optional(),
  description: z.string().optional(),
  lessonType: z.string().optional(),
  videoUrl: z.string().url().optional(),
  isFree: z.boolean().optional(),
})

type FormValues = z.input<typeof formSchema>

export const EditLessonForm = () => {
  const router = useRouter()
  const courseId = useCourseId()
  const lessonId = useLessonId()
  const chapterId = useChapterId()

  const { data: lesson, isPending: lessonLoading } = useGetLesson({
    id: lessonId,
  })

  const { mutate: editLesson, isPending: editLessonLoading } = useEditLesson({
    id: lessonId,
    chapterId,
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: lesson?.title || '',
      description: lesson?.description || '',
      lessonType: lesson?.lessonType || '',
      videoUrl: lesson?.videoUrl || '',
      isFree: lesson?.isFree || false,
    },
  })

  useEffect(() => {
    if (lesson) {
      form.setValue('title', lesson?.title || '')
      form.setValue('description', lesson?.description || '')
      form.setValue('lessonType', lesson?.lessonType || '')
      form.setValue('videoUrl', lesson?.videoUrl || '')
      form.setValue('isFree', lesson?.isFree || false)
    }
  }, [lesson, form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    editLesson(values, { onSuccess: () => {} })
  }

  if (lessonLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!lesson) {
    return null
  }

  const requiredFields = [
    lesson.title,
    isEmptyHtml(lesson.description) ? '' : lesson.description,
    lesson.videoUrl,
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `${completedFields}/${totalFields}`

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-x-2">
          <h1 className="text-2xl font-medium">Lesson Creation</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
        <EditToolbar
          disabled={!isComplete}
          isPublished={!!lesson.isPublished}
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
                    disabled={editLessonLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            disabled={editLessonLoading}
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
          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-none border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormDescription>
                    Check this box if you want to make this chapter free for
                    preview
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <VideoForm
                    value={field.value}
                    onChange={url => {
                      if (url) onSubmit({ videoUrl: url })
                    }}
                    chapterId={chapterId}
                    // type={
                    //   field.value?.includes('youtube.com')
                    //     ? 'youtube'
                    //     : 'upload'
                    // }
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-5">
            <Link
              href={`/admin/courses/edit/${courseId}/chapters/${chapterId}`}
            >
              <Button variant="outline" type="button">
                Back to Lessons
              </Button>
            </Link>
            <Button type="submit" disabled={editLessonLoading}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
