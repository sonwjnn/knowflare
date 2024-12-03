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
  const [isUrlConfirmed, setIsUrlConfirmed] = useState(false)
  const allowedDomains = [
    'utfs.io',
    'images.unsplash.com',
    'picsum.photos',
    'i.ytimg.com',
  ]

  const isAllowedUrl = (url: string) => {
    try {
      const { hostname } = new URL(url)
      return allowedDomains.some(domain => hostname.includes(domain))
    } catch {
      return false
    }
  }

  const handleConfirmUrl = () => {
    if (isAllowedUrl(value)) {
      setIsUrlConfirmed(true)
      toast.success('URL is valid and image will be used.')
    } else {
      setIsUrlConfirmed(false)
      toast.error('Invalid URL. Please use a valid domain.')
    }
  }

  const handleUploadComplete = (res: { url: string }[]) => {
    const uploadedUrl = res?.[0]?.url
    if (uploadedUrl) {
      onChange(uploadedUrl)
      setIsUrlConfirmed(true)
      toast.success('Image uploaded and confirmed.')
    }
  }
  return (
    <div className="flex flex-col gap-4">
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Upload"
          className="aspect-square w-[200px] object-cover"
        />
      )}

      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={res => onChange(res?.[0].url)}
        // onUploadError={(error: Error) => toast.error(`${error?.message}`)}
      />
    </div>
  )
}
