'use client'

import { CreateChapterModal } from '@/features/admin/chapters/components/create-chapter-modal'
import { CreateLessonModal } from '@/features/admin/lessons/components/create-lesson-modal'
import { CreateCourseModal } from '@/features/courses/components/create-course-modal'
import { useEffect, useState } from 'react'

export const Modals = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <CreateChapterModal />
      <CreateLessonModal />
      <CreateCourseModal />
    </>
  )
}
