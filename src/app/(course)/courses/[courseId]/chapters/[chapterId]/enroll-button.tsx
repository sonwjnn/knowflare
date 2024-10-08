'use client'

import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'

interface EnrollButtonProps {
  price: number
  courseId: string
}

export const EnrollButton = ({ price, courseId }: EnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    // try {
    //   setIsLoading(true);
    //   const response = await axios.post(`/api/courses/${courseId}/checkout`);
    //   window.location.assign(response.data.url);
    // } catch (err) {
    //   toast.error("Something went wrong");
    //  } finally {
    //   setIsLoading(false);
    // }
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm"
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  )
}
