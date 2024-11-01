'use client'

import { ourFileRouter } from '@/app/api/uploadthing/core'
import { UploadDropzone } from '@/lib/uploadthing'
import Image from 'next/image'
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

      {page === 'Edit Section' && value !== '' && (
        <p className="text-sm font-medium">{value}</p>
      )}

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
    </div>
  )
}
