import { useParams } from 'next/navigation'

export const useChapterId = () => {
  const params = useParams()

  return params.chapterId as string
}
