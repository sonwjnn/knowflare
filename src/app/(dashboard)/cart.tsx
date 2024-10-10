import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export const Cart = () => {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const cartItems = [
    {
      id: 1,
      name: 'Course 1',
      price: 199000,
      quantity: 2,
      image: '/placeholder.svg?height=80&width=80',
    },
    {
      id: 2,
      name: 'Course 2',
      price: 399000,
      quantity: 1,
      image: '/placeholder.svg?height=80&width=80',
    },
    {
      id: 3,
      name: 'Course 3',
      price: 599000,
      quantity: 1,
      image: '/placeholder.svg?height=80&width=80',
    },
  ]

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 300)
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-white text-primary hover:bg-gray-100"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 border-gray-800 p-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="rounded-t-sm bg-primary py-3 text-primary-foreground">
            <CardTitle className="text-lg font-semibold">Your cart</CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Giỏ hàng trống</p>
            ) : (
              <ul className="space-y-4">
                {cartItems.map(item => (
                  <li key={item.id} className="flex items-center space-x-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="rounded object-cover"
                      width={80}
                      height={80}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.price.toLocaleString('vi-VN')} ₫
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <Separator />
          <CardFooter className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-lg font-bold">
                {total.toLocaleString('vi-VN')} ₫
              </p>
            </div>
            <Link href="/cart" onClick={() => setIsOpen(false)}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Go to cart
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
