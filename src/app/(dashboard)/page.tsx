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
            <section className="relative py-24 bg-gray-50">
                {/* Decorative background elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50/50" />
                    <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-50/50" />
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <span className="mb-4 inline-block rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600">
                            Why Choose Us
                        </span>
                        <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                            The Knowflare <span className="text-indigo-600">Advantage</span>
                        </h2>
                        <p className="mx-auto mb-16 max-w-2xl text-lg text-gray-600">
                            Experience the difference with our innovative approach to online learning
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* Feature Cards */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl">
                            <div className="mb-6 inline-flex rounded-xl bg-indigo-50 p-4">
                                <Book className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="mb-4 text-2xl font-semibold text-gray-900">
                                Learn from the Best
                            </h3>
                            <p className="text-gray-600">
                                Access courses from top universities and industry leaders worldwide.
                            </p>
                        </div>

                        <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl">
                            <div className="mb-6 inline-flex rounded-xl bg-blue-50 p-4">
                                <Globe className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="mb-4 text-2xl font-semibold text-gray-900">
                                Flexible Learning
                            </h3>
                            <p className="text-gray-600">
                                Study at your own pace, anytime and anywhere in the world.
                            </p>
                        </div>

                        <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl">
                            <div className="mb-6 inline-flex rounded-xl bg-indigo-50 p-4">
                                <Zap className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="mb-4 text-2xl font-semibold text-gray-900">
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
            <section className="relative overflow-hidden py-24 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl border border-gray-200 bg-white p-12 shadow-lg">
                        <div className="grid items-center gap-8 md:grid-cols-2">
                            <div>
                                <div className="mb-6 inline-flex items-center rounded-full bg-indigo-50 px-4 py-2 text-sm text-indigo-600">
                                    ✨ Special Offer for New Students
                                </div>
                                <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
                                    Transform Your Future <br />
                                    <span className="text-indigo-600">Through Education</span>
                                </h2>
                                <p className="mb-8 text-xl leading-relaxed text-gray-600">
                                    Start your learning journey with 7 days of unlimited access.
                                    Join our community of over 1 million learners worldwide.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Button
                                        size="lg"
                                        className="bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        Start Free Trial
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-2 hover:bg-gray-50"
                                    >
                                        View Courses
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-indigo-50" />
                                    <div className="relative rounded-full bg-white p-8 shadow-lg">
                                        <GraduationCap className="h-32 w-32 text-indigo-600" />
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
