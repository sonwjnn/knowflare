import { ourFileRouter } from '@/app/api/uploadthing/core'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadDropzone } from '@/lib/uploadthing'
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
  const [useUrl, setUseUrl] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      {page === 'Edit Course' && value !== '' && (
        <Image
          src={value}
          alt="image"
          width={500}
          height={500}
          className="h-[200px] w-[280px] rounded-xl object-cover"
        />
      )}

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setUseUrl(!useUrl)}>
          {useUrl ? 'Upload Image' : 'Enter URL'}
        </Button>
      </div>

      {useUrl ? (
        <Input
          placeholder="Enter image URL"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={res => {
            onChange(res?.[0].url)
          }}
          onUploadError={(error: Error) => {
            toast.error(error.message)
          }}
          className="h-[200px] w-[280px]"
        />
      )}
    </div>
  )
}
