import { useParams } from 'next/navigation'

export const useCategoryId = () => {
  const params = useParams()

  return params.categoryId as string
}
