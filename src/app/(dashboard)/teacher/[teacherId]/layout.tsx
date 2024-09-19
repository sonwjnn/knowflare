'use client'

import { useGetCurrentTeacher } from '@/features/teachers/use-get-current-teacher'
import { redirect } from 'next/navigation'
import React from 'react'

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { data, isPending } = useGetCurrentTeacher()

  if (!data && !isPending) return redirect('/')

  return <>{children}</>
}

export default TeacherLayout
