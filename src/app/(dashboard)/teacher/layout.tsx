import { currentUser } from '@/features/auth/utils'
import { isTeacher } from '@/lib/utils'
import { redirect } from 'next/navigation'
import React from 'react'

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser()

  if (!isTeacher(user?.id)) return redirect('/')

  return <>{children}</>
}

export default TeacherLayout
