'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCreateCart } from '@/features/carts/use-create-cart'
import { useGetCartByCourseId } from '@/features/carts/use-get-cart-by-course-id'
import { useGetCourse } from '@/features/courses/api/use-get-course'
import { useCreateWishlist } from '@/features/wishlists/use-create-wishlist'
import { useDeleteWishlist } from '@/features/wishlists/use-delete-wishlist'
import { useGetWishlistByCourseId } from '@/features/wishlists/use-wishlist-cart-by-course-id'
import { useCourseId } from '@/hooks/use-course-id'
import { format } from 'date-fns'
import {
  BarChart,
  Clock,
  Heart,
  Loader,
  Play,
  ShoppingCart,
  Star,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Comments } from './comments'

const DATE_FORMAT = 'dd/MM/yyyy'

export default function CourseDetail() {
  const router = useRouter()
  const courseId = useCourseId()
  const { data: course, isPending: courseLoading } = useGetCourse(courseId)

  const { mutate: createCart, isPending: createCartLoading } = useCreateCart()
  const { data: cart, isPending: cartLoading } = useGetCartByCourseId(courseId)

  const { mutate: createWishlist, isPending: createWishlistLoading } =
    useCreateWishlist()
  const { data: wishlist, isPending: wishlistLoading } =
    useGetWishlistByCourseId(courseId)
  const { mutate: deleteWishlist, isPending: deleteWishlistLoading } =
    useDeleteWishlist(wishlist?.id)

  const isWishlistLoading =
    createWishlistLoading || wishlistLoading || deleteWishlistLoading
  const isCartLoading = createCartLoading || cartLoading

  const courseDetails = {
    title: course?.title,
    instructor: course?.user?.name,
    rating: 4.8,
    students: 12345,
    lastUpdated: course?.date,
    description: course?.description,
    price: course?.price,
    image: course?.imageUrl,
  }

  const onClickCart = () => {
    if (cart) {
      router.push('/cart')
    } else {
      createCart({ courseId })
    }
  }

  const onClickWishlist = () => {
    if (wishlist) {
      deleteWishlist()
    } else {
      createWishlist({ courseId })
    }
  }

  if (courseLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="size-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Image
            src={courseDetails.image!}
            alt={courseDetails.title!}
            width={0}
            height={0}
            sizes="100vw"
            className="mb-6 aspect-video h-auto w-full rounded-lg object-cover"
          />
          <h1 className="mb-4 text-3xl font-bold">{courseDetails.title}</h1>

          <p className="mb-4 text-xl">{courseDetails.description}</p>
          <div className="mb-4 flex items-center">
            <Star className="mr-1 fill-yellow-400 text-yellow-400" />
            <span className="mr-2 font-bold">{+courseDetails.rating}</span>
            <span className="text-gray-600">
              ({courseDetails.students.toLocaleString()} students)
            </span>
          </div>
          <p className="mb-4">
            Created by{' '}
            <span className="font-semibold">{courseDetails.instructor}</span>
          </p>
          <p className="mb-4">
            Last updated:{' '}
            {format(new Date(courseDetails.lastUpdated!), DATE_FORMAT)}
          </p>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>What you&apos;ll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      Build powerful, fast, user-friendly and reactive web apps
                    </li>
                    <li>
                      Provide amazing user experiences by leveraging the power
                      of JavaScript with ease
                    </li>
                    <li>
                      Apply for high-paid jobs or work as a freelance developer
                    </li>
                    <li>Learn all about React Hooks and React Components</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="chapters">
              <Card>
                <CardHeader>
                  <CardTitle>Course Chapters</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal space-y-2 pl-5">
                    {course?.chapters.map(item => (
                      <li key={item.id}>{item.title}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="instructor">
              <Card>
                <CardHeader>
                  <CardTitle>Instructor</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src="/placeholder.svg"
                      alt={courseDetails.instructor!}
                    />
                    <AvatarFallback>
                      {courseDetails.instructor?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {courseDetails.instructor}
                    </h3>
                    <p className="text-gray-600">Senior React Developer</p>
                    <p className="mt-2">
                      Jane has been teaching React for over 5 years and has
                      helped thousands of students master modern web
                      development.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <Comments />
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                ${courseDetails.price}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-x-2">
                <Button
                  className="w-full py-6 text-lg"
                  onClick={onClickCart}
                  disabled={isCartLoading}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {cart ? 'Go to cart' : 'Add to cart'}
                </Button>
                <Button
                  variant="outline"
                  disabled={isWishlistLoading}
                  className="px-4 py-6 text-lg"
                  onClick={onClickWishlist}
                >
                  <Heart
                    className={`size-5 ${wishlist ? 'fill-current' : ''}`}
                  />
                </Button>
              </div>
              <Button variant="outline" className="w-full px-4 py-6 text-lg">
                Buy now
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Play className="mr-2 h-5 w-5" />
                  <span>12 hours of video</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  <span>All levels</span>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5" />
                  <span>Certificate</span>
                </div>
              </div>

              <Link href={`/courses/${courseId}/learn`}>
                <Button variant="outline" className="w-full px-4 py-6 text-lg">
                  Learn now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
