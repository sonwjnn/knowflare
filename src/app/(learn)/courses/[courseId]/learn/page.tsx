'use client'

import { useGetFirstLesson } from '@/features/lessons/api/use-get-first-lesson'
import { useCourseId } from '@/hooks/use-course-id'
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'

//
const LearnPage = () => {
  const courseId = useCourseId()

  const { data: firstLesson, isPending: firstLessonLoading } =
    useGetFirstLesson({ courseId })

  if (firstLessonLoading) {
    return (
      <div className="h-screen w-full">
        <div className="flex h-full items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!firstLesson) return redirect(`/courses/${courseId}`)

  return redirect(`/courses/${courseId}/learn/lessons/${firstLesson.id}`)
}

export default LearnPage
