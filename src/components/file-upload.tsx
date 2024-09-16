import { ourFileRouter } from '@/app/api/uploadthing/core'
import { UploadDropzone } from '@/lib/uploadthing'
import { toast } from 'sonner'

interface FileUploadProps {
  onChange: (url?: string) => void
  endpoint: keyof typeof ourFileRouter
}
const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={res => {
        onChange(res?.[0].url)
      }}
      onUploadError={() => {
        toast.error('Something went wrong')
      }}
    />
  )
}

export default FileUpload
