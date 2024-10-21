'use client'

import { FiltersSheet } from '@/components/filters-sheet'
import { ChaptersSheet } from '@/features/chapters/components/chapters-sheet'
import { CommentsSheet } from '@/features/comments/components/comments-sheet'
import { useCommentsSheet } from '@/features/comments/store/use-comments-sheet'
import { useMountedState } from 'react-use'

export const SheetProvider = () => {
  const [open] = useCommentsSheet()
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      {open && <CommentsSheet />}

      <FiltersSheet />
      <ChaptersSheet />
    </>
  )
}
