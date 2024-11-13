'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn, formatDateRange } from '@/lib/utils'
import { format, subDays } from 'date-fns'
import { ChevronDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

export const DateFilter = () => {
  const router = useRouter()
  const pathname = usePathname()

  const params = useSearchParams()
  const accountId = params.get('accountId')
  const from = params.get('from') || ''
  const to = params.get('to') || ''

  const defaultTo = new Date()
  const defaultFrom = subDays(defaultTo, 30 * 12)

  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  }

  const [date, setDate] = useState<DateRange | undefined>(paramState)

  const pushToUrl = (dateRange: DateRange | undefined) => {
    const query = {
      from: format(dateRange?.from || defaultFrom, 'yyyy-MM-dd'),
      to: format(dateRange?.to || defaultTo, 'yyyy-MM-dd'),
      // accountId, //TODO: add accountId to url when we have multiple accounts
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    )

    router.push(url)
  }

  const onReset = () => {
    setDate(undefined)
    pushToUrl(undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          size="sm"
          className="h-9 w-full rounded-md border-none px-3 font-normal outline-none transition focus:ring-transparent focus:ring-offset-0 lg:w-auto"
        >
          <span>{formatDateRange(paramState)}</span>
          <ChevronDown className="ml02 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 lg:w-auto" align="start">
        <Calendar
          disabled={false}
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />

        <div className="flex w-full items-center gap-x-2 p-4">
          <PopoverClose asChild>
            <Button
              onClick={onReset}
              disabled={!date?.from || !date.to}
              className="w-full"
              variant="outline"
            >
              Reset
            </Button>
          </PopoverClose>

          <PopoverClose asChild>
            <Button
              onClick={() => pushToUrl(date)}
              disabled={!date?.from || !date.to}
              className="w-full"
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
