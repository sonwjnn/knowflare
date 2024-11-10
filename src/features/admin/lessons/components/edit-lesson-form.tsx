'use client'

import { FileUpload } from '@/components/custom//file-upload'
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
import { useEditLesson } from '@/features/admin/lessons/api/use-edit-lesson'
import { useGetLesson } from '@/features/admin/lessons/api/use-get-lesson'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useCourseId } from '@/hooks/use-course-id'
import { useLessonId } from '@/hooks/use-lesson-id'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title is required and must be at least 2 characters long',
  }),
  description: z.string().optional(),
  lessonType: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  isFree: z.boolean().optional(),
})

type FormValues = z.input<typeof formSchema>

export const EditLessonForm = () => {
  const courseId = useCourseId()
  const lessonId = useLessonId()
  const chapterId = useChapterId()
  const { data: lesson, isPending: lessonLoading } = useGetLesson({
    id: lessonId,
  })

  const { mutate: editLesson, isPending: editLessonLoading } =
    useEditLesson(lessonId)

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

  const { isValid, isSubmitting } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    editLesson(values, { onSuccess: () => {} })
  }

  if (lessonLoading || editLessonLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
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

          <div className="flex gap-5">
            <Link
              href={`/admin/courses/edit/${courseId}/chapters/${chapterId}`}
            >
              <Button variant="outline" type="button">
                Back to Lessons
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
