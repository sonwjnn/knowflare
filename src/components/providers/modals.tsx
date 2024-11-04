'use client'

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
      <CreateCourseModal />
    </>
  )
}
