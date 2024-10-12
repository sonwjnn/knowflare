'use client'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useCurrentUser } from '@/hooks/use-current-user'
import Autoplay from 'embla-carousel-autoplay'
import { Book, Globe, Star, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

interface Course {
  id: number
  title: string
  institution: string
  rating: number
  students: string
  image: string
  price: number
}

export default function KnowflareHomepage() {
  const currentUser = useCurrentUser()
  const [cartItems, setCartItems] = useState<Course[]>([])

  const categories = [
    'Data Science',
    'Business',
    'Computer Science',
    'Information Technology',
    'Language Learning',
    'Health',
    'Personal Development',
    'Physical Science and Engineering',
    'Social Sciences',
    'Arts and Humanities',
  ]

  const featuredCourses = [
    {
      id: 1,
      title: 'Machine Learning',
      institution: 'Stanford University',
      rating: 4.8,
      students: '3.8M',
      image: '/placeholder.svg?height=400&width=600',
      price: 49.99,
    },
    {
      id: 2,
      title: 'The Science of Well-Being',
      institution: 'Yale University',
      rating: 4.9,
      students: '3.6M',
      image: '/placeholder.svg?height=400&width=600',
      price: 39.99,
    },
    {
      id: 3,
      title: 'Financial Markets',
      institution: 'Yale University',
      rating: 4.7,
      students: '1.2M',
      image: '/placeholder.svg?height=400&width=600',
      price: 59.99,
    },
    {
      id: 4,
      title: 'Programming for Everybody (Getting Started with Python)',
      institution: 'University of Michigan',
      rating: 4.8,
      students: '2.3M',
      image: '/placeholder.svg?height=400&width=600',
      price: 49.99,
    },
  ]

  const heroSlides = [
    {
      title: 'Unlock Your Potential with World-Class Learning',
      description:
        'Join millions of learners worldwide and explore a universe of knowledge. Start your journey to success today!',
      image:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1080',
      ctaText: 'Get Started',
      href: currentUser ? '/courses' : '/sign-in',
    },
    {
      title: 'Learn from Industry Experts',
      description:
        'Access courses taught by leading professionals and gain real-world skills to advance your career.',
      image:
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1080',
      ctaText: 'Explore Courses',
      href: '/courses',
    },
    {
      title: 'Flexible Learning for Busy Professionals',
      description:
        'Study at your own pace with our on-demand courses and flexible schedules.',
      image:
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1080',
      ctaText: 'Start Learning',
      href: '/my-courses',
    },
  ]

  const addToCart = (course: Course) => {
    setCartItems([...cartItems, course])
  }

  const plugin = useRef(Autoplay({ delay: 2000 }))

  return (
    <main>
      <section className="relative">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {heroSlides.map((item, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={`Slide ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="brightness-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
                        {item.title}
                      </h1>
                      <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100 md:text-xl">
                        {item.description}
                      </p>
                      <Link href={item.href}>
                        <Button className="bg-emerald-600 px-8 py-3 text-lg text-white hover:bg-emerald-500">
                          {item.ctaText}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 fill-black" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 fill-black" />
        </Carousel>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Why Choose Knowflare?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mb-4 rounded-full bg-blue-100 p-4">
                <Book className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Learn from the Best
              </h3>
              <p className="text-gray-600">
                Access courses from top universities and industry leaders
                worldwide.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mb-4 rounded-full bg-green-100 p-4">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Flexible Learning</h3>
              <p className="text-gray-600">
                Study at your own pace, anytime and anywhere in the world.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mb-4 rounded-full bg-purple-100 p-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Career Advancement</h3>
              <p className="text-gray-600">
                Gain skills and credentials to boost your career prospects.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold">Featured Courses</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredCourses.map(course => (
              <div
                key={course.id}
                className="overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-300 hover:scale-105"
              >
                <Image
                  src={course.image}
                  alt={course.title}
                  width={600}
                  height={400}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-semibold">{course.title}</h3>
                  <p className="mb-2 text-sm text-gray-600">
                    {course.institution}
                  </p>
                  <div className="mb-2 flex items-center">
                    <Star className="mr-1 h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {course.rating}
                    </span>
                    <span className="ml-2 text-sm text-gray-400">
                      ({course.students} students)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      ${course.price.toFixed(2)}
                    </span>
                    <Button onClick={() => addToCart(course)}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold">Top categories</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.slice(0, 10).map(category => (
              <Button
                key={category}
                variant="outline"
                className="justify-start text-left"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-8 shadow-lg">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-2/3">
                <h2 className="mb-4 text-3xl font-bold text-white">
                  Start Your Learning Journey Today
                </h2>
                <p className="mb-6 text-lg text-blue-100">
                  Join millions of learners and unlock your potential with
                  Knowflare. Get started for free!
                </p>
                <Button className="bg-white text-blue-700 hover:bg-blue-50">
                  Sign up now
                </Button>
              </div>
              <div className="mt-8 md:mt-0">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Join Knowflare"
                  width={300}
                  height={200}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
