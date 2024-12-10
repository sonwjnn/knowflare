'use client'

import { CreateCategoryModal } from '@/features/admin/categories/components/create-category-modal'
import { CreateChapterModal } from '@/features/admin/chapters/components/create-chapter-modal'
import { CreateCouponModal } from '@/features/admin/coupons/components/create-coupon-modal'
import { CreateCourseModal } from '@/features/admin/courses/components/create-course-modal'
import { CreateLessonModal } from '@/features/admin/lessons/components/create-lesson-modal'
import { ChangePasswordModal } from '@/features/auth/components/change-password-modal'
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
      <CreateCouponModal />
      <CreateLessonModal />
      <CreateCategoryModal />
      <CreateCourseModal />
      <ChangePasswordModal />
    </>
  )
}
