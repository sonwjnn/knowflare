import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCarts } from '@/features/carts/use-get-carts'
import { useGetCourses } from '@/features/courses/api/use-get-courses'
import { useGetWishlists } from '@/features/wishlists/use-get-carts'
import { BookOpen } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

import { Item } from './item'

export const List = () => {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || ''
  const categoryId = searchParams.get('categoryId') || ''

  const { data: carts, isPending: cartsLoading } = useGetCarts()
  const { data: wishlists, isPending: wishlistsLoading } = useGetWishlists()

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

  if (courses?.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="w-full max-w-md border-0">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-semibold">
              No Courses Available
            </h2>
            <p className="mb-4 text-muted-foreground">
              It looks like there are no courses available at the moment. Check
              back later for new additions!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses?.map(item => {
        const wishlistId = wishlists?.find(w => w.courseId === item.id)?.id
        const cartId = carts?.find(w => w.courseId === item.id)?.id

        return (
          <Item
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            price={item.price}
            cartId={cartId}
            wishlistId={wishlistId}
          />
        )
      })}
    </div>
  )
}
