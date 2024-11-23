'use client'

import { CreateCartButton } from '@/app/(dashboard)/wishlist/create-cart-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCarts } from '@/features/carts/api/use-get-carts'
import { useAddAllToCart } from '@/features/wishlists/api/use-add-all-to-cart'
import { useGetWishlists } from '@/features/wishlists/api/use-get-carts'
import { Award, BookOpen, Clock, ShoppingCart, Star } from 'lucide-react'

import { Item } from './item'

export default function EnhancedPurchasedCourses() {
  const { data: courses, isPending: coursesLoading } = useGetWishlists()
  const { data: carts, isPending: cartsLoading } = useGetCarts()
  const { mutate: addAllToCart, isPending: addAllToCartLoading } =
    useAddAllToCart()

  const handleAddAllToCart = () => {
    if (courses?.length === 0) return

    addAllToCart()
  }

  if (coursesLoading) {
    return <CourseCardSkeleton />
  }

  if (courses?.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex w-2/3 flex-col items-center justify-center">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-semibold tracking-wide">
            Your wishlist is empty
          </h2>
          <p className="mb-4 w-1/2 text-center text-muted-foreground">
            You haven&apos;t added any courses to your wishlist yet. Explore our
            catalog and add courses you&apos;re interested in to start your
            learning journey!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-8xl mx-auto mt-16 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Wishlist</h1>
        <Button
          onClick={handleAddAllToCart}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={addAllToCartLoading}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add All to Cart
        </Button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {courses?.map(item => {
            const isInWishlist = !!courses.some(
              c => c.courseId === item.courseId
            )
            const isInCart = !!carts?.find(w => w.courseId === item.courseId)

            return (
              <Item
                key={item.courseId}
                id={item.courseId}
                title={item.title}
                imageUrl={item.imageUrl}
                price={item.price}
                author={item.author || ''}
                isInWishlist={isInWishlist}
                isInCart={isInCart}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

const CourseCardSkeleton = () => {
  return (
    <div className="max-w-8xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Wishlist</h1>

      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card
            key={index}
            className="flex animate-pulse flex-col overflow-hidden"
          >
            <div className="relative">
              <Skeleton className="aspect-video w-full" />
            </div>
            <CardHeader className="px-4 pb-4">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="flex-grow px-4">
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="mr-2 h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="mr-2 h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-4 pt-4">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
