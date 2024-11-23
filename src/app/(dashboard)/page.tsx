'use client'

import { LoaderHomepage } from '@/components/loader-homepage'
import { Button } from '@/components/ui/button'
import { Book, Globe, GraduationCap, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useMountedState } from 'react-use'

import { Hero } from './hero'
import { Marquee } from './marquee'
import { TopCategories } from './top-categories'
import { TopCourses } from './top-courses'

export default function KnowflareHomepage() {
  const [mounted, setMounted] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return <LoaderHomepage />
  return (
    <main className="bg-gradient-to-b from-gray-50 to-white">
      <Hero />
      <Marquee />

      {/* Why Choose Section */}
      <section className="relative py-24">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50 blur-3xl" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-purple-50 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
              Why Choose Knowflare?
            </h2>
            <p className="mx-auto mb-16 max-w-2xl text-lg text-gray-600">
              Discover the features that make us the leading platform for online
              learning
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature Cards */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-100">
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 opacity-60 blur-2xl transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
              <div className="mb-6 inline-flex rounded-xl bg-blue-100 p-4">
                <Book className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold">
                Learn from the Best
              </h3>
              <p className="text-gray-600">
                Access courses from top universities and industry leaders
                worldwide.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-green-100">
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-green-100 to-green-50 opacity-60 blur-2xl transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
              <div className="mb-6 inline-flex rounded-xl bg-green-100 p-4">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold">Flexible Learning</h3>
              <p className="text-gray-600">
                Study at your own pace, anytime and anywhere in the world.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-100">
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 opacity-60 blur-2xl transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
              <div className="mb-6 inline-flex rounded-xl bg-purple-100 p-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold">
                Career Advancement
              </h3>
              <p className="text-gray-600">
                Gain skills and credentials to boost your career prospects.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TopCategories />
      <TopCourses />
      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-1">
            <div className="relative rounded-[23px] bg-white p-12">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
                    Ready to Start Learning?
                  </h2>
                  <p className="mb-8 text-xl leading-relaxed text-gray-600">
                    Join millions of learners and start your journey today. Get
                    unlimited access to all courses.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      Start Free Trial
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 hover:bg-gray-50"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-100 blur-3xl" />
                    <div className="relative rounded-full bg-gradient-to-b from-indigo-100 to-white p-8">
                      <GraduationCap className="h-32 w-32 text-indigo-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
