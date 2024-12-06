'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Command, Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/hooks/use-debounce'

interface SearchBarProps {
    className?: string
}

export const SearchBar = ({ className }: SearchBarProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const title = searchParams.get('title') || ''
    const categoryId = searchParams.get('categoryId') || ''
    const level = searchParams.get('level') || ''
    const rating = searchParams.get('rating') || ''

    const [searchQuery, setSearchQuery] = useState(title)
    const [isFocused, setIsFocused] = useState(false)
    const debouncedValue = useDebounce(searchQuery, 500)

    const onClear = () => {
        setSearchQuery('')
        const url = qs.stringifyUrl(
            {
                url: pathname,
                query: {
                    title: '',
                    categoryId,
                    level,
                    rating,
                },
            },
            { skipNull: true, skipEmptyString: true }
        )
        router.push(url)
    }

    useEffect(() => {
        const url = qs.stringifyUrl(
            {
                url: pathname,
                query: {
                    title: debouncedValue,
                    categoryId,
                    level,
                    rating,
                },
            },
            { skipNull: true, skipEmptyString: true }
        )
        router.push(url)
    }, [debouncedValue, router, pathname, categoryId, level, rating])

    return (
        <div className={cn('relative w-full max-w-[600px]', className)}>
            <div
                className={cn(
                    'group relative flex items-center transition-all duration-300',
                    isFocused && 'scale-[1.01]'
                )}
            >
                <div
                    className={cn(
                        'absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-blue-500/20 opacity-0 blur-xl transition-all duration-500',
                        isFocused && 'opacity-100'
                    )}
                />
                <div className="absolute left-4 flex h-5 w-5 items-center justify-center">
                    {isFocused ? (
                        <Command className="h-[18px] w-[18px] text-purple-500 transition-all duration-300" />
                    ) : (
                        <Search className="h-[18px] w-[18px] text-gray-400 transition-all duration-300" />
                    )}
                </div>
                <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={cn(
                        'h-12 w-full border-0 bg-white pl-12 pr-12 text-sm font-medium shadow-none ring-2 ring-gray-100 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-purple-500/50',
                        'rounded-2xl transition-all duration-300',
                        isFocused && 'ring-purple-500/20 focus-visible:ring-purple-500'
                    )}
                    placeholder="Tìm kiếm khóa học..."
                />
                {searchQuery && (
                    <button
                        onClick={onClear}
                        className="absolute right-4 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-[18px] w-[18px] transition-all duration-300" />
                    </button>
                )}
            </div>

            {/* Search Shortcut Badge */}
            {/* <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
        <div
          className={cn(
            'flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-400',
            'transition-all duration-300',
            isFocused && 'opacity-0'
          )}
        >
          <span className="text-xs">⌘</span>
          <span>K</span>
        </div>
      </div> */}
        </div>
    )
} 