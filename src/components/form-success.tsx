import { CircleCheck } from 'lucide-react'

interface FormSuccessProps {
  message?: string
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null

  return (
    <div className="flex items-center gap-x-2 rounded-none bg-emerald-500/15 p-3 text-sm text-emerald-500">
      <CircleCheck className="size-4" />
      <p>{message}</p>
    </div>
  )
}
