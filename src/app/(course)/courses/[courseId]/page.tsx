'use client'

import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { useGetCourse } from '@/features/courses/api/use-get-course'
import { useCourseId } from '@/hooks/use-course-id'
import { Loader } from 'lucide-react'
import { redirect } from 'next/navigation'

const CourseIdPage = () => {
  const courseId = useCourseId()

  const { data: course, isPending: courseLoading } = useGetCourse(courseId)
  const { data: chapters, isPending: chaptersLoading } = useGetChapters(
    course?.id
  )

  if (courseLoading || chaptersLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!course || !chapters) return redirect('/')

  return redirect(`/courses/${course.id}/chapters/${chapters[0].id}`)
}

export default CourseIdPage
