import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCarts } from '@/features/carts/use-get-carts'
import { useGetCourses } from '@/features/courses/api/use-get-courses'
import { useSearchParams } from 'next/navigation'

import { Item } from './item'

export const List = () => {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || ''
  const categoryId = searchParams.get('categoryId') || ''

  const { data: carts, isPending: cartsLoading } = useGetCarts()

  const { data: courses, isPending: coursesLoading } = useGetCourses({
    categoryId: categoryId === 'all' ? '' : categoryId,
    title,
  })

  const isPending = cartsLoading || coursesLoading

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-6 w-3/4" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-4 h-4 w-2/3" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses?.map(item => {
        return (
          <Item
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            price={item.price}
            isInCart={!!carts?.some(cartItem => cartItem.courseId === item.id)}
          />
        )
      })}
    </div>
  )
}
