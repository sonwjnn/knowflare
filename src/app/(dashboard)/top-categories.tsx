'use client'

import { Badge } from '@/components/ui/badge'
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
  Loader2,
  LucideIcon,
  MessageCircle,
  User,
} from 'lucide-react'
import Link from 'next/link'

export const TopCategories = () => {
  const { data: categories, isPending: categoriesLoading } = useGetCategories()
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
    <section className="mx-auto max-w-6xl py-16">
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
        Top Categories
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {(categories ?? []).map(item => {
          const Icon = iconMap[item.name] ?? Book

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
  )
}
