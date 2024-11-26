'use client'

import FileUpload from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UploadDropzone } from '@/lib/uploadthing'
import { Pencil, PlayCircle, PlusCircle, Video } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { toast } from 'sonner'
import * as z from 'zod'

const ReactPlayerYoutube = dynamic(() => import('react-player/youtube'), {
  ssr: false,
})
const ReactPlayerUpload = dynamic(() => import('react-player'), {
  ssr: false,
})

const formSchema = z.object({
  value: z.string().min(1),
})

interface ChapterVideoFormProps {
  onChange: (url?: string) => void
  value: string | undefined
  chapterId: string
  type: 'youtube' | 'upload'
}

export const VideoForm = ({
  onChange,
  value,
  chapterId,
  type,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => {
    setIsEditing(current => !current)
  }

  return (
    <div className="mt-6 rounded-none border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Lesson Video
        <Button onClick={toggleEdit} variant="ghost" type="button">
          {isEditing && <>Cancel</>}
          {!isEditing && !value && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an Video
            </>
          )}
          {!isEditing && value && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!value ? (
          <div className="flex h-60 items-center justify-center rounded-none bg-slate-200">
            <PlayCircle className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            {type === 'youtube' && (
              <ReactPlayerYoutube
                url={value || ''}
                width="100%"
                height="100%"
                controls
              />
            )}
            {type === 'upload' && (
              <ReactPlayerUpload
                url={value || ''}
                width="100%"
                height="100%"
                controls
              />
            )}
          </div>
        ))}
      {isEditing && (
        <div>
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">Enter URL</TabsTrigger>
              <TabsTrigger value="upload">Upload Video</TabsTrigger>
            </TabsList>

            <TabsContent value="url">
              <Input
                placeholder="Enter video URL (youtube.com)"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full"
              />
            </TabsContent>
            <TabsContent value="upload">
              <UploadDropzone
                endpoint="lessonVideo"
                onClientUploadComplete={res => {
                  onChange(res?.[0].url)
                }}
                onUploadError={(error: Error) => {
                  toast.error(error.message)
                }}
                className="h-[200px]"
              />
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-xs text-muted-foreground">
            Upload this lesson&apos;s video
          </div>
        </div>
      )}
      {value && !isEditing && (
        <div className="text-s mt-2 text-muted-foreground">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear
        </div>
      )}
    </div>
  )
}
