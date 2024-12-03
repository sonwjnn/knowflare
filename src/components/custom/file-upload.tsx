import { ourFileRouter } from '@/app/api/uploadthing/core'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UploadDropzone } from '@/lib/uploadthing'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

interface FileUploadProps {
  value: string
  onChange: (url?: string) => void
  endpoint: keyof typeof ourFileRouter
  page: string
}
export const FileUpload = ({
  value,
  onChange,
  endpoint,
  page,
}: FileUploadProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => {
    setIsEditing(current => !current)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center font-medium">
        <Button
          onClick={toggleEdit}
          variant="ghost"
          type="button"
          className="ml-auto"
        >
          {isEditing && <>Cancel</>}
          {!isEditing && !value && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an Image
            </>
          )}
          {!isEditing && value && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!value ? (
          <div className="flex size-[200px] items-center justify-center rounded-none bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2">
            <Image
              src={value}
              alt="Upload"
              width={200}
              height={200}
              className="aspect-square rounded-md object-cover"
            />
          </div>
        ))}
      {isEditing && (
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={res => onChange(res?.[0].url)}
          onUploadError={(error: Error) => {
            toast.error(`${error.message}`)
          }}
        />
      )}
    </div>
  )
}
