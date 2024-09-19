import { useParams } from 'next/navigation'

export const useTeacherId = () => {
  const params = useParams()

  return params.teacherId as string
}
