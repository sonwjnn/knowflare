'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useGetTopCategories } from '@/features/categories/api/use-get-top-categories'
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
    Loader2,
    LucideIcon,
    MessageCircle,
    User,
} from 'lucide-react'
import Link from 'next/link'

export const TopCategories = () => {
    const { data: categories, isPending: categoriesLoading } = useGetCategories()
    const { data: topCategories, isPending: topCategoriesLoading } =
        useGetTopCategories()
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

    if (categoriesLoading) {
        return (
            <section className="mx-auto max-w-6xl py-16">
                <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
                    Top Categories
                </h2>
                <div className="flex h-full min-h-64 w-full items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            </section>
        )
    }

    if (!categories) {
        return (
            <section className="mx-auto max-w-6xl py-16">
                <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
                    Top Categories
                </h2>
                <div className="flex h-full min-h-48 w-full items-center justify-center">
                    <p>No categories found.</p>
                </div>
            </section>
        )
    }

    return (
        <section className="mx-auto max-w-7xl py-20 px-4">
            <div className="text-center mb-16">
                <h2 className="text-2xl font-bold text-gray-900">
                    Explore Our <span className="text-blue-600">Learning Paths</span>
                </h2>
                <p className="mt-4 text-gray-600">
                    Choose from our diverse range of categories to start your learning journey
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {(categories ?? []).map(item => {
                    const Icon = iconMap[item.name] ?? Book

                    return (
                        <Link href={`/courses?categoryId=${item.id}`} key={item.id}>
                            <div className="group relative h-[180px] bg-white rounded-xl 
                                transition-all duration-300 hover:-translate-y-1
                                border border-gray-100 hover:border-blue-100
                                hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent 
                                    rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <div className="relative h-full p-5 flex flex-col">
                                    <div className="mb-4">
                                        <div className="inline-flex rounded-lg bg-blue-50 p-2.5
                                            group-hover:bg-blue-100/80 transition-colors duration-300">
                                            <Icon className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="h-[44px] text-[15px] font-semibold text-gray-900 mb-2.5 line-clamp-2
                                            group-hover:text-blue-700 transition-colors duration-300">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-500 bg-gray-50 
                                                px-2.5 py-1 rounded-full">
                                                {10} courses
                                            </span>
                                            <span className="flex items-center text-blue-600 font-medium">
                                                <span className="text-xs mr-1.5 translate-x-0 group-hover:translate-x-1 
                                                    transition-transform duration-300">
                                                    Explore
                                                </span>
                                                <svg 
                                                    className="w-3.5 h-3.5 transform translate-x-0 group-hover:translate-x-1
                                                        transition-transform duration-300" 
                                                    fill="none" 
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round"
                                                        strokeWidth={2} 
                                                        d="M17 8l4 4m0 0l-4 4m4-4H3" 
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
