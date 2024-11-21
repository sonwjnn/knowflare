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
            <h2 className="mb-16 text-center text-3xl font-bold text-gray-900">
                Explore Categories
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {(categories ?? []).map(item => {
                    const Icon = iconMap[item.name] ?? Book

                    return (
                        <Link href={`/courses?categoryId=${item.id}`} key={item.id}>
                            <div className="group relative h-[220px] bg-blue-50/50 rounded-2xl 
                                overflow-hidden transition-all duration-300 hover:bg-blue-100/50">
                                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-blue-100 transition-all duration-300 group-hover:bg-blue-200" />

                                <div className="relative h-full p-8 flex flex-col">
                                    <div className="mb-auto">
                                        <Icon className="h-8 w-8 text-blue-600" />
                                    </div>

                                    <div>
                                        <h3 className="h-14 text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                {10} courses available
                                            </span>
                                            <span className="flex items-center text-blue-600 transform transition-transform duration-300  group-hover:translate-x-2">
                                                <span className="text-sm">Explore</span>
                                                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                        strokeWidth={2} d="M9 5l7 7-7 7" />
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
