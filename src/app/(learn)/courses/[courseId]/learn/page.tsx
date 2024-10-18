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

  if (!chapters) redirect(`/courses`)

  return redirect(`/courses/${courseId}/learn/chapters/${chapters[0]?.id}`)
}

export default LearnPage
