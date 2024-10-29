import { useParams } from 'next/navigation'

export const useUserId = () => {
  const params = useParams()

  return params.userId as string
}
