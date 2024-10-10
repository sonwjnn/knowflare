'use client'

import { useUpsertProgressChapter } from '@/features/chapters/api/use-upsert-progress-chapter'
import { cn } from '@/lib/utils'
import { useConfettiStore } from '@/store/use-confetti-store'
import MuxPlayer from '@mux/mux-player-react'
import { Loader2, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface VideoPlayerProps {
  playbackId: string
  courseId: string
  chapterId: string
  nextChapterId: string
  isLocked: boolean
  completeOnEnd: boolean
  title: string
}
export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const { mutate: progressChapter, isPending: progressChapterLoading } =
    useUpsertProgressChapter(chapterId)
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()
  const [_open, setOpen] = useConfettiStore()

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        progressChapter({
          isCompleted: true,
        })
      }
      if (!nextChapterId) {
        setOpen(true)
      }

      toast.success('Progress updated')
      router.refresh()

      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
      }
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }

  return (
    <div className="relative aspect-video">
      {!isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && 'hidden')}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId || ''}
        />
      )}
    </div>
  )
}
