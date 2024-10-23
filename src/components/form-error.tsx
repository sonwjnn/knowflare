import { FaExclamationTriangle } from 'react-icons/fa'

interface FormErrorProps {
  message?: string
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null

  return (
    <div className="flex items-center gap-x-2 rounded-none bg-destructive/15 p-3 text-sm text-destructive">
      <FaExclamationTriangle className="size-4" />
      <p>{message}</p>
    </div>
  )
}
