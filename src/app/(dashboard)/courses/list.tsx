'use client'

import Paginator from '@/components/paginator'
import { Card, CardContent } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCarts } from '@/features/carts/api/use-get-carts'
import { useGetCourses } from '@/features/courses/api/use-get-courses'
import { useGetWishlists } from '@/features/wishlists/api/use-get-carts'
import { ArrowUpAZ, BookOpen, Clock, DollarSign } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useMemo, useState } from 'react'

import { Item } from './item'
import { SearchBar } from '@/components/search-bar'

const sortOptions = [
    {
        value: 'newest',
        label: 'Newest First',
        icon: <Clock className="h-4 w-4" />,
    },
    {
        value: 'price-low',
        label: 'Price: Low to High',
        icon: <DollarSign className="h-4 w-4" />,
    },
    {
        value: 'price-high',
        label: 'Price: High to Low',
        icon: <ArrowUpAZ className="h-4 w-4" />,
    },
]

export const List = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const title = searchParams.get('title') || ''
    const categoryId = searchParams.get('categoryId') || ''
    const pageNumber = searchParams.get('pageNumber') || ''
    const level = searchParams.get('level') || ''
    const rating = searchParams.get('rating') || ''

    const [sortOption, setSortOption] = useState<string | null>(null)

    const { data: carts, isPending: cartsLoading } = useGetCarts()
    const { data: wishlists, isPending: wishlistsLoading } = useGetWishlists()

    const { data: coursesData, isPending: coursesLoading } = useGetCourses({
        categoryId: categoryId === 'all' ? '' : categoryId,
        title,
        level,
        rating,
        pageNumber,
    })

    const courses = useMemo(() => coursesData?.courses, [coursesData])
    const pageCount = useMemo(() => coursesData?.pageCount, [coursesData])

    const isPending = coursesLoading

    const sortedCourses = useMemo(() => {
        if (!courses) return []

        return [...courses].sort((a, b) => {
            switch (sortOption) {
                case 'newest':
                    return new Date(b.date).getTime() - new Date(a.date).getTime()
                case 'price-low':
                    return a.price - b.price
                case 'price-high':
                    return b.price - a.price
                default:
                    return +b.title - +a.title
            }
        })
    }, [courses, sortOption])

    const onPageChange = (value: number) => {
        const isSelected = value === +pageNumber

        if (isSelected) return

        const url = qs.stringifyUrl(
            {
                url: pathname,
                query: {
                    level,
                    title,
                    categoryId,
                    rating,
                    pageNumber: value,
                },
            },
            { skipNull: true, skipEmptyString: true }
        )
        router.push(url, { scroll: true })
    }

    return (
        <div className="flex flex-col">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchBar className="sm:max-w-[400px]" />

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Arrange:</span>
                    <Select value={sortOption || ''} onValueChange={setSortOption}>
                        <SelectTrigger className="w-[200px] rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-300 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2">
                            <SelectValue placeholder="Choose order" className="text-sm font-medium text-gray-700" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border border-gray-200 bg-white shadow-lg">
                            {sortOptions.map(option => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="flex cursor-pointer items-center gap-2 px-4 py-2 transition-all duration-300 hover:bg-purple-50"
                                >
                                    <div className="flex items-center gap-2">
                                        {option.icon}
                                        <span className="text-sm font-medium text-gray-800">{option.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isPending && (
                <div className="grid w-full grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, index) => (
                        <Card key={index} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-6">
                                <Skeleton className="mb-4 h-6 w-3/4" />
                                <Skeleton className="mb-2 h-4 w-full" />
                                <Skeleton className="mb-4 h-4 w-2/3" />
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!isPending && courses?.length === 0 && (
                <div className="flex h-[50vh] items-center justify-center">
                    <div className="flex w-2/3 flex-col items-center justify-center">
                        <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h2 className="mb-2 text-2xl font-semibold">Không tìm thấy khóa học</h2>
                        <p className="mb-4 text-center text-muted-foreground">
                            Không tìm thấy khóa học phù hợp với tiêu chí tìm kiếm của bạn.
                            Vui lòng thử lại với các tiêu chí khác!
                        </p>
                    </div>
                </div>
            )}

            {!isPending && courses && courses.length > 0 && (
                <>
                    <div className="mb-4 flex justify-between">
                        <p className="text-sm text-gray-600">
                            Display <b>{courses.length}</b> courses
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 xl:grid-cols-3 2xl:grid-cols-4">
                        {sortedCourses.map(item => {
                            const isInWishlist = !!wishlists?.find(w => w.courseId === item.id)
                            const isInCart = !!carts?.find(w => w.courseId === item.id)
                            const isDiscounted =
                                !!item.discountPrice && item.discountPrice !== item.price

                            return (
                                <Item
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    description={item.description}
                                    imageUrl={item.imageUrl}
                                    price={item.price}
                                    discountPrice={isDiscounted ? +item.discountPrice : null}
                                    couponId={isDiscounted ? item.couponId : null}
                                    author={item.author.name!}
                                    totalChapters={item.totalChapters}
                                    rating={item.avgRating}
                                    isPurchased={!!item.isPurchased}
                                    isInCart={isInCart}
                                    isInWishlist={isInWishlist}
                                />
                            )
                        })}
                    </div>

                    <div className="my-8 flex justify-center">
                        {pageCount !== 1 && (
                            <Paginator
                                currentPage={+pageNumber || 1}
                                totalPages={pageCount || 0}
                                onPageChange={value => onPageChange(value)}
                                showPreviousNext
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
