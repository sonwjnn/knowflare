'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// Sample cart items (in a real app, this would come from a global state or API)
const initialCartItems = [
  {
    id: 1,
    title: 'Introduction to Machine Learning',
    instructor: 'Dr. Jane Smith',
    image: '/placeholder.svg?height=400&width=600',
    price: 49.99,
    quantity: 1,
  },
  {
    id: 2,
    title: 'Advanced Python Programming',
    instructor: 'Prof. John Doe',
    image: '/placeholder.svg?height=400&width=600',
    price: 59.99,
    quantity: 1,
  },
]

// Sample suggested courses
const suggestedCourses = [
  {
    id: 3,
    title: 'Data Science Fundamentals',
    instructor: 'Dr. Emily Brown',
    image: '/placeholder.svg?height=400&width=600',
    price: 39.99,
    rating: 4.7,
    students: '15,000',
  },
  {
    id: 4,
    title: 'Web Development Bootcamp',
    instructor: 'Sarah Johnson',
    image: '/placeholder.svg?height=400&width=600',
    price: 69.99,
    rating: 4.9,
    students: '20,000',
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      setCartItems(
        cartItems.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const addToCart = (course: any) => {
    const existingItem = cartItems.find(item => item.id === course.id)
    if (existingItem) {
      updateQuantity(course.id, existingItem.quantity + 1)
    } else {
      setCartItems([...cartItems, { ...course, quantity: 1 }])
    }
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const tax = subtotal * 0.1 // Assuming 10% tax
  const total = subtotal + tax

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-2/3">
          {cartItems.length === 0 ? (
            <div className="rounded-lg bg-white p-6 text-center shadow">
              <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
              <p className="mb-4 text-gray-600">
                Looks like you haven&apos;t added any courses yet.
              </p>
              <Link href="/search">
                <Button>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg bg-white shadow">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center border-b border-gray-200 p-6"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={120}
                    height={80}
                    className="mr-6 rounded-lg object-cover"
                  />
                  <div className="flex-grow">
                    <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                    <p className="mb-2 text-sm text-gray-600">
                      {item.instructor}
                    </p>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={e =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                        className="mx-2 w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="mb-2 text-lg font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:w-1/3">
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            <div className="mb-2 flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span>Estimated Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button className="mt-6 w-full" size="lg">
              Proceed to Checkout
            </Button>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">You might also like</h2>
            {suggestedCourses.map(course => (
              <div
                key={course.id}
                className="mb-4 flex items-center border-b border-gray-200 pb-4 last:mb-0 last:border-b-0 last:pb-0"
              >
                <Image
                  src={course.image}
                  alt={course.title}
                  width={80}
                  height={60}
                  className="mr-4 rounded-lg object-cover"
                />
                <div className="flex-grow">
                  <h3 className="mb-1 font-semibold">{course.title}</h3>
                  <p className="mb-1 text-sm text-gray-600">
                    {course.instructor}
                  </p>
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 text-yellow-400" />
                    <span className="mr-2 text-sm text-gray-600">
                      {course.rating}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({course.students} students)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="mb-2 font-semibold">
                    ${course.price.toFixed(2)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToCart(course)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
