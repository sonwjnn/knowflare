'use client'

import { ChaptersSheet } from '@/features/chapters/components/chapters-sheet'
import { CommentsSheet } from '@/features/comments/components/comments-sheet'
import { useMountedState } from 'react-use'

export const SheetProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      <CommentsSheet />
      <ChaptersSheet />
    </>
  )
}
