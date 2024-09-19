'use client'

import FileUpload from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import { attachments, courses } from '@/db/schema'
import axios from 'axios'
import { File, Loader2, Pencil, PlusCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import * as z from 'zod'

interface AttachmentFormProps {
  initialData: (typeof attachments.$inferSelect)[]
  courseId: string
  courseImageUrl?: string | null
}
const formSchema = z.object({
  url: z.string().min(1),
})

const AttachmentForm = ({
  initialData,
  courseId,
  courseImageUrl,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const toggleEdit = () => {
    setIsEditing(current => !current)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values)
      toggleEdit()
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    }
  }
  const onDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
      toast.success('Attachment Deleted')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }
  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course Attachment
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !courseImageUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an attachment
            </>
          )}
          {!isEditing && courseImageUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit attachment
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData?.length === 0 && (
            <p className="mt-2 text-sm italic text-slate-500">
              No attachments yet
            </p>
          )}
          {initialData?.length >= 0 && (
            <div className="space-y-2">
              {initialData?.map(attachment => (
                <div
                  key={attachment?.id}
                  className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
                >
                  <File className="mr-2 h-4 w-4 flex-shrink-0" />
                  <p className="line-clamp-1 text-xs">{attachment?.name}</p>
                  {deletingId === attachment?.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment?.id && (
                    <button
                      onClick={() => onDelete(attachment?.id)}
                      className="ml-auto transition hover:opacity-75"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={url => {
              if (url) onSubmit({ url: url })
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Add anything your student might need to complete the course
          </div>
        </div>
      )}
    </div>
  )
}

export default AttachmentForm
