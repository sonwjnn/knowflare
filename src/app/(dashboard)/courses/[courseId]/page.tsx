'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCreateCart } from '@/features/carts/api/use-create-cart'
import { useGetCartByCourseId } from '@/features/carts/api/use-get-cart-by-course-id'
import { useGetCourse } from '@/features/courses/api/use-get-course'
import { useGetCurrentPurchase } from '@/features/purchases/api/use-get-current-purchases'
import { useGetReviews } from '@/features/reviews/api/use-get-reviews'
import { useCreateWishlist } from '@/features/wishlists/api/use-create-wishlist'
import { useDeleteWishlist } from '@/features/wishlists/api/use-delete-wishlist'
import { useGetWishlistByCourseId } from '@/features/wishlists/api/use-wishlist-cart-by-course-id'
import { useCourseId } from '@/hooks/use-course-id'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import {
  ArrowRight,
  Award,
  BarChart,
  Check,
  Clock,
  FileText,
  Heart,
  Loader2,
  Play,
  ShoppingCart,
  Star,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { GoHeartFill } from 'react-icons/go'

import { Reviews } from './reviews'

const DATE_FORMAT = 'dd/MM/yyyy'

const courseObjectives = [
  'Understand the fundamentals of the course',
  'Build real-world projects',
  'Learn best practices and advanced techniques',
  'Master professional development workflows',
  'Get a certificate of completion',
  'Access to a private community',
  'Lifetime access to the course',
  '30-Day Money-Back Guarantee',
  'Full refund if you&apos;re not satisfied',
  'No commitment, cancel anytime',
  // Thêm các mục tiêu khác nếu cần
]

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
    useDeleteWishlist(wishlist?.courseId)

  const { data: reviews, isPending: reviewsLoading } = useGetReviews(courseId)
  const { data: currentPurchase, isPending: currentPurchaseLoading } =
    useGetCurrentPurchase(courseId)

  const isWishlistLoading =
    createWishlistLoading || wishlistLoading || deleteWishlistLoading
  const isCartLoading = createCartLoading || cartLoading

  const rating = useCallback(() => {
    if (!reviews || reviews.length === 0) return 0
    const totalRating = reviews.reduce(
      (acc, comment) => acc + comment.rating,
      0
    )
    return totalRating / reviews.length
  }, [reviews])

  const courseDetails = {
    title: course?.title,
    instructor: course?.user?.name,
    rating: rating(),
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

  const onBuyNow = () => {
    if (!cart) {
      createCart({ courseId })
    }

    router.push('/cart')
  }

  if (courseLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE]">
      <div className="relative bg-gradient-to-br from-white to-blue-50 pb-20 pt-24">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-20 h-32 w-32 rounded-full bg-blue-100/40 blur-3xl" />
          <div className="absolute right-1/4 top-40 h-40 w-40 rounded-full bg-purple-100/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/courses" className="hover:text-blue-600">
              Courses
            </Link>
            <span>/</span>
            <span className="text-gray-400">{courseDetails.title}</span>
          </div>

          <div className="flex flex-col gap-16 lg:flex-row lg:items-start">
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-600">
                    Featured Course
                  </div>
                  <div className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-600">
                    Bestseller
                  </div>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                  {courseDetails.title}
                </h1>

                <p className="text-xl leading-relaxed text-gray-600">
                  {courseDetails.description}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl bg-white p-6 shadow-md">
                  <div className="mb-2 text-sm font-medium text-gray-500">
                    Course Rating
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'size-5',
                            i < Math.floor(courseDetails.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-gray-200 text-gray-200'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                      {courseDetails.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-md">
                  <div className="mb-2 text-sm font-medium text-gray-500">
                    Total Students
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="size-6 text-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      {courseDetails.students.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-md">
                  <div className="mb-2 text-sm font-medium text-gray-500">
                    Last Updated
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="size-6 text-green-600" />
                    <span className="text-lg font-medium text-gray-900">
                      {format(
                        new Date(courseDetails.lastUpdated!),
                        DATE_FORMAT
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructor Card */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-md">
                <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    About the Instructor
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="size-20 border-4 border-white shadow-md">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={courseDetails.instructor!}
                      />
                      <AvatarFallback>
                        {courseDetails.instructor?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h4 className="text-xl font-semibold text-gray-900">
                        {courseDetails.instructor}
                      </h4>
                      <p className="text-gray-600">
                        Professional Developer & Instructor
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Play className="size-4" />
                          <span>15 Courses</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="size-4" />
                          <span>50K+ Students</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-8 shadow-lg">
                <h3 className="mb-8 text-2xl font-semibold text-gray-900">
                  What you&apos;ll learn
                </h3>
                <ul className="grid gap-6 md:grid-cols-2">
                  {courseObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                        <Check className="size-5" />
                      </div>
                      <span className="text-md text-gray-600">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:w-[300px]">
              <div className="sticky top-24 space-y-4">
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                  <div className="relative aspect-video">
                    <Image
                      src={courseDetails.image!}
                      alt={courseDetails.title!}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-3 py-1.5 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-white">
                        <Play className="size-4" />
                        <span className="text-sm font-medium">
                          Preview Available
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 p-6">
                    {/* Price Section */}
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div className="text-4xl font-bold text-gray-900">
                          ${courseDetails.price}
                        </div>
                        <div className="text-sm text-gray-500">
                          <s>
                            ${((courseDetails.price ?? 0) * 1.7).toFixed(2)}
                          </s>
                          <span className="ml-2 text-green-600">70% off</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <Clock className="size-4" />
                        <span>Sale ends in 2 days</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {!currentPurchase && (
                      <div className="space-y-3">
                        <Button
                          className="h-14 w-full bg-blue-600 text-lg font-semibold tracking-wide hover:bg-blue-700"
                          onClick={onBuyNow}
                        >
                          <ShoppingCart className="mr-2 size-5" />
                          Enroll Now
                        </Button>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 border-2 py-6 font-medium hover:bg-gray-50"
                            onClick={onClickCart}
                            disabled={isCartLoading}
                          >
                            {cart ? 'Go to Cart' : 'Add to Cart'}
                          </Button>

                          <Button
                            variant="outline"
                            className="aspect-square border-2 py-6"
                            onClick={onClickWishlist}
                            disabled={isWishlistLoading}
                          >
                            <GoHeartFill
                              className={cn(
                                'size-6 transition-all',
                                wishlist
                                  ? 'scale-110 text-red-500'
                                  : 'text-gray-400 hover:scale-110 hover:text-red-500'
                              )}
                            />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Course Features */}
                    <div className="space-y-4 rounded-xl bg-gray-50 p-5">
                      <h4 className="font-medium text-gray-900">
                        This course includes:
                      </h4>
                      <ul className="space-y-3">
                        {[
                          {
                            icon: Play,
                            text: '12 hours on-demand video',
                            color: 'text-purple-600',
                            bg: 'bg-purple-50',
                          },
                          {
                            icon: FileText,
                            text: 'Downloadable resources',
                            color: 'text-blue-600',
                            bg: 'bg-blue-50',
                          },
                          {
                            icon: Clock,
                            text: 'Lifetime access',
                            color: 'text-green-600',
                            bg: 'bg-green-50',
                          },
                          {
                            icon: Award,
                            text: 'Certificate of completion',
                            color: 'text-amber-600',
                            bg: 'bg-amber-50',
                          },
                        ].map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <div className={cn('rounded-lg p-2', feature.bg)}>
                              <feature.icon
                                className={cn('size-4', feature.color)}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Money Back Guarantee */}
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                      <div className="rounded-full bg-green-50 p-2 text-green-600">
                        <Check className="size-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-medium text-gray-900">
                          30-Day Money-Back Guarantee
                        </div>
                        <div className="text-sm text-gray-500">
                          Full refund if you&apos;re not satisfied
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 md:px-6">
        {/* <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h3 className="mb-8 text-2xl font-semibold text-gray-900">
            What you&apos;ll learn
          </h3>
          <ul className="grid gap-6 md:grid-cols-2">
            {courseObjectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                  <Check className="size-5" />
                </div>
                <span className="text-lg text-gray-600">{objective}</span>
              </li>
            ))}
          </ul>
        </div> */}

        {/* Chapters Section */}
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h3 className="mb-8 text-2xl font-semibold text-gray-900">
            Course Chapters
          </h3>
          {/* Add your chapters content here */}
        </div>

        {/* Reviews Section */}
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h3 className="mb-8 text-2xl font-semibold text-gray-900">
            Student Reviews
          </h3>
          <Reviews />
        </div>
      </div>
    </div>
  )
}
