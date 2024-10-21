import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCarts } from '@/features/carts/use-get-carts'
import { useGetCourses } from '@/features/courses/api/use-get-courses'
import { useGetWishlists } from '@/features/wishlists/use-get-carts'
import { BookOpen } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import { Item } from './item'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]

export const List = () => {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const level = searchParams.get('level') || ''

  const [sortOption, setSortOption] = useState<string | null>(null)

  const { data: carts, isPending: cartsLoading } = useGetCarts()
  const { data: wishlists, isPending: wishlistsLoading } = useGetWishlists()

  const { data: courses, isPending: coursesLoading } = useGetCourses({
    categoryId: categoryId === 'all' ? '' : categoryId,
    title,
    level,
  })

  const isPending = coursesLoading

  const sortedCourses = useMemo(() => {
    if (!courses) return []

    return [...courses].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        default:
          return +b.title - +a.title
      }
    })
  }, [courses, sortOption])

  if (isPending) {
    return (
      <div className="grid w-full grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, index) => (
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
        <div className="flex w-2/3 flex-col items-center justify-center">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-semibold">No Courses Available</h2>
          <p className="mb-4 text-center text-muted-foreground">
            It looks like there are no courses available at the moment. Check
            back later for new additions!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex justify-between">
        <p>
          Showing <b>{(courses ?? []).length} courses</b>
        </p>
        <div>
          <Select value={sortOption || ''} onValueChange={setSortOption}>
            <SelectTrigger className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent">
              <SelectValue placeholder="Sort courses" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {sortedCourses.map(item => {
          const isInWishlist = !!wishlists?.find(w => w.courseId === item.id)
          const isInCart = !!carts?.find(w => w.courseId === item.id)

          return (
            <Item
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              price={item.price}
              isInCart={isInCart}
              isInWishlist={isInWishlist}
            />
          )
        })}
      </div>
    </div>
  )
}
