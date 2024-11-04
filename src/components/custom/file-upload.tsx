import { ourFileRouter } from '@/app/api/uploadthing/core'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  const isValidUrl = value.startsWith('http') || value.startsWith('/')

  return (
    <div className="flex flex-col gap-4">
      {page === 'Edit Course' && value !== '' && isValidUrl && (
        <Image
          src={value}
          alt="image"
          width={500}
          height={500}
          className="h-[200px] w-[280px] rounded-xl object-cover"
        />
      )}

      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Enter URL</TabsTrigger>
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
        </TabsList>

        <TabsContent value="url">
          <Input
            placeholder="Enter image URL (utfs.io, images.unsplash.com, picsum.photos, i.ytimg.com)"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full"
          />
        </TabsContent>
        <TabsContent value="upload">
          <UploadDropzone
            endpoint={endpoint}
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
    </div>
  )
}
