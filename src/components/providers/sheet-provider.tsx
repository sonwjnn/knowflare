'use client'

import { ChaptersSheet } from '@/features/chapters/components/chapters-sheet'
import { CommentsSheet } from '@/features/comments/components/comments-sheet'
import { useCommentsSheet } from '@/features/comments/store/use-comments-sheet'
import { useMountedState } from 'react-use'

export const SheetProvider = () => {
  const isMounted = useMountedState()
  const [open] = useCommentsSheet()

  if (!isMounted) return null

  return (
    <>
      {open && <CommentsSheet />}
      <ChaptersSheet />
    </>
  )
}
