import { type ClassValue, clsx } from 'clsx'
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export const isTeacher = (userId: string | null | undefined) => {
  console.log(userId, process.env.NEXT_PUBLIC_TEACHER_ID)
  return userId === process.env.NEXT_PUBLIC_TEACHER_ID
}

export const isEmptyHtml = (htmlString: string | null) => {
  if (!htmlString) return true

  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlString

  const text = tempDiv.innerText.trim()

  return text === ''
}

type Period = {
  from: string | Date | undefined
  to: string | Date | undefined
}

export const formatDateRange = (period?: Period) => {
  const defaultTo = new Date()
  const defaultFrom = subDays(defaultTo, 30)

  if (!period?.from) {
    return `${format(defaultFrom, 'LLL dd')} - ${format(defaultTo, 'LLL dd,y')}`
  }

  if (period.to) {
    return `${format(period.from, 'LLL dd')} - ${format(
      period.to,
      'LLL dd, y'
    )}`
  }
}
