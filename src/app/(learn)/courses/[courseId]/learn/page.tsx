'use client'

import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { useCourseId } from '@/hooks/use-course-id'
import { redirect } from 'next/navigation'

const LearnPage = () => {
  const courseId = useCourseId()

  const { data: chapters, isPending: chaptersLoading } =
    useGetChapters(courseId)

  if (chaptersLoading) {
    return <div>Loading ...</div>
  }

  if (!chapters || !chapters?.[0]?.lessons?.[0]) redirect(`/courses`)

  return redirect(
    `/courses/${courseId}/learn/lessons/${chapters?.[0]?.lessons?.[0]?.id}`
  )
}

export default LearnPage
