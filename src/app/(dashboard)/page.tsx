'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import {
  BarChart,
  Book,
  BookOpen,
  Briefcase,
  Building2,
  Computer,
  Globe,
  GraduationCap,
  Heart,
  Icon,
  Loader,
  LucideIcon,
  MessageCircle,
  User,
  Zap,
} from 'lucide-react'
import 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Hero } from './hero'
import { Marquee } from './marquee'

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
  const iconMap: { [key: string]: LucideIcon } = {
    'Teaching & Academics': GraduationCap,
    'Sales & Marketing': BarChart,
    'Personal Development': User,
    Management: Briefcase,
    Language: Globe,
    IT: Computer,
    Health: Heart,
    English: MessageCircle,
    'Engineering & Construction': Building2,
    Business: BookOpen,
  }

  const { data: categories, isPending: categoriesLoading } = useGetCategories()

  return (
    <main>
      <Hero />
      <Marquee />

      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Why Choose Knowflare?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-none bg-white p-6 text-center shadow-md">
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
            <div className="flex flex-col items-center rounded-none bg-white p-6 text-center shadow-md">
              <div className="mb-4 rounded-full bg-green-100 p-4">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Flexible Learning</h3>
              <p className="text-gray-600">
                Study at your own pace, anytime and anywhere in the world.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-none bg-white p-6 text-center shadow-md">
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

      <section className="mx-auto max-w-6xl py-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Top Categories
        </h2>
        {categoriesLoading && (
          <div className="flex h-full min-h-64 w-full items-center justify-center">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories?.map(item => {
            const Icon = iconMap[item.name]

            return (
              <Link href={`/courses?categoryId=${item.id}`} key={item.id}>
                <Card className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                    <div className="mb-4 rounded-full bg-slate-100 p-3">
                      <Icon className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="mb-2 line-clamp-2 h-12 font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <Badge variant="secondary">{10} courses</Badge>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-none bg-white shadow-xl">
            <div className="flex flex-col items-center justify-between p-8 md:flex-row">
              <div className="mb-6 md:mb-0 md:w-2/3">
                <h2 className="mb-4 text-3xl font-bold text-gray-800">
                  Ready to Start Learning?
                </h2>
                <p className="mb-6 text-xl text-gray-600">
                  Join millions of learners and start your journey today. Get
                  unlimited access to all courses.
                </p>
                <div className="flex space-x-4">
                  <Button size="lg">Start Free Trial</Button>

                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="flex justify-center md:w-1/3">
                <div className="rounded-full bg-slate-100 p-6">
                  <GraduationCap className="h-24 w-24 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
