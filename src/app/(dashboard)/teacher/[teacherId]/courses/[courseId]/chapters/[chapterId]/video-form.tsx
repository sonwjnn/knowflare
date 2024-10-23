'use client'

import FileUpload from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import { chapters, muxData } from '@/db/schema'
import { useEditChapter } from '@/features/chapters/api/use-edit-chapter'
import MuxPlayer from '@mux/mux-player-react'
import { Pencil, PlusCircle, Video } from 'lucide-react'
import { useState } from 'react'
import * as z from 'zod'

const formSchema = z.object({
  videoUrl: z.string().min(1),
})

interface ChapterVideoFormProps {
  initialData: typeof chapters.$inferInsert & {
    muxData: typeof muxData.$inferInsert | null
  }
  courseId: string
  chapterId: string
}

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const { mutate: editMutation, isPending } = useEditChapter(chapterId)

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => {
    setIsEditing(current => !current)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    editMutation(values, {
      onSuccess: () => {
        toggleEdit()
      },
    })
  }
  return (
    <div className="mt-6 rounded-none border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData?.videoUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an Video
            </>
          )}
          {!isEditing && initialData?.videoUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData?.videoUrl ? (
          <div className="flex h-60 items-center justify-center rounded-none bg-slate-200">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ''} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={url => {
              if (url) onSubmit({ videoUrl: url })
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData?.videoUrl && !isEditing && (
        <div className="text-s mt-2 text-muted-foreground">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear
        </div>
      )}
    </div>
  )
}

export default ChapterVideoForm
