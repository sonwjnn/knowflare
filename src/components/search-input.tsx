'use client'

import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useCallback, useEffect, useState } from 'react'

import { Input } from './ui/input'

interface AnimatedSearchInputProps {
  className?: string
}

const AnimatedSearchInput = ({ className }: AnimatedSearchInputProps) => {
  const pathname = usePathname()
  const [value, setValue] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)

  const currentyCategoryId = searchParams.get('categoryId')

  const onClick = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const url = qs.stringifyUrl(
        {
          url: '/courses',
          query: {
            categoryId: currentyCategoryId,
            title: value,
          },
        },
        { skipEmptyString: true, skipNull: true }
      )
      router.push(url)
    },
    [currentyCategoryId, value, router]
  )

  const onClear = useCallback(() => {
    setValue('')

    if (pathname.includes('/courses')) {
      const url = qs.stringifyUrl(
        {
          url: '/courses',
          query: {
            categoryId: currentyCategoryId,
          },
        },
        { skipEmptyString: true, skipNull: true }
      )
      router.push(url)
    }
  }, [currentyCategoryId, router, pathname])

  const handleBlur = useCallback(() => {
    if (!value) {
      setIsExpanded(false)
    }
  }, [value])

  return (
    <form onSubmit={onClick} className="relative">
      <motion.div
        className="relative flex items-center"
        initial={{ width: '40px' }}
        animate={{ width: isExpanded ? '300px' : '40px' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <motion.button
          type="button"
          className={cn(
            `absolute left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-transparent ${
              isExpanded ? 'pointer-events-none' : ''
            }`,
            className
          )}
          onClick={() => setIsExpanded(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search className={cn('h-5 w-5', className)} />
        </motion.button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Input
                id="search"
                name="search"
                onChange={e => setValue(e.target.value)}
                onBlur={handleBlur}
                value={value}
                className={cn(
                  'h-10 w-full rounded-full border bg-transparent pl-12 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-2',
                  className
                )}
                placeholder="Search for a course"
                type="text"
                autoFocus
              />
              {value && (
                <motion.button
                  type="button"
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center"
                  onClick={onClear}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className={cn('h-4 w-4', className)} />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </form>
  )
}

export default AnimatedSearchInput
