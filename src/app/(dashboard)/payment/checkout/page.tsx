'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, CreditCard, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// Sample cart items (in a real app, this would come from a global state or API)
const cartItems = [
  {
    id: 1,
    title: 'Introduction to Machine Learning',
    instructor: 'Dr. Jane Smith',
    image: '/placeholder.svg?height=400&width=600',
    price: 49.99,
  },
  {
    id: 2,
    title: 'Advanced Python Programming',
    instructor: 'Prof. John Doe',
    image: '/placeholder.svg?height=400&width=600',
    price: 59.99,
  },
]

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const subtotal = cartItems.reduce((total, item) => total + item.price, 0)
  const tax = subtotal * 0.1 // Assuming 10% tax
  const total = subtotal + tax

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormErrors({})

    // Simulate form validation

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Order placed successfully!')
    }, 2000)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-2/3">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg bg-white p-6 shadow"
          >
            <h2 className="mb-4 text-xl font-semibold">Billing Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select name="country">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" name="postalCode" />
              </div>
            </div>

            <h2 className="mb-4 mt-8 text-xl font-semibold">Payment Method</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="mb-2 flex items-center space-x-2">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <Label htmlFor="credit-card" className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Credit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center">
                  <span className="mr-2 font-bold text-blue-600">Pay</span>
                  <span className="font-bold text-blue-800">Pal</span>
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === 'credit-card' && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input id="cardName" name="cardName" />
                </div>
                <div>
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    name="expirationDate"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" name="cvv" />
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="mt-4">
                <p className="text-gray-600">
                  You will be redirected to PayPal to complete your purchase
                  securely.
                </p>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="ml-2 text-sm">
                  I agree to the{' '}
                  <Link href="#" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </Link>
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </Button>
          </form>
        </div>

        <div className="lg:w-1/3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            {cartItems.map(item => (
              <div
                key={item.id}
                className="mb-4 flex items-center border-b border-gray-200 pb-4 last:mb-0 last:border-b-0 last:pb-0"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={80}
                  height={60}
                  className="mr-4 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.instructor}</p>
                  <p className="mt-1 font-semibold">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="mt-4 border-t border-gray-200 pt-4">
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
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
