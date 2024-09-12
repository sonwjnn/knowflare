'use client'

import { useDebounce } from '@/hooks/use-debounce'
import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useEffect, useState } from 'react'

import { Input } from './ui/input'

const SearchInput = () => {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const currentyCategoryId = searchParams.get('categoryId')

  // TODO: fix this
  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentyCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    )
    router.push(url)
  }, [debouncedValue, pathname, currentyCategoryId, router])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
      <Input
        onChange={e => setValue(e.target.value)}
        value={value}
        className="w-full rounded-full bg-slate-100 pl-9 focus-visible:ring-slate-200 md:w-[300px]"
        placeholder="Search for a course"
      />
    </div>
  )
}

export default SearchInput
