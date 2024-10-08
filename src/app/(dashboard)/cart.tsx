import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface Course {
  id: number
  title: string
  institution: string
  rating: number
  students: string
  image: string
  price: number
}

export const Cart = () => {
  const [cartItems, setCartItems] = useState<Course[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const removeFromCart = (courseId: number) => {
    setCartItems(cartItems.filter(item => item.id !== courseId))
  }

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0)

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="flex items-center"
        onClick={() => setIsCartOpen(!isCartOpen)}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        <span className="sr-only">Shopping cart</span>
        <span className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-200 text-xs font-semibold text-blue-800">
          {cartItems.length}
        </span>
      </Button>
      {isCartOpen && (
        <div className="absolute right-0 z-10 mt-2 w-80 rounded-md bg-white shadow-lg">
          <div className="p-4">
            <h3 className="mb-2 text-lg font-semibold">Shopping Cart</h3>
            {cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                {cartItems.map(item => (
                  <div
                    key={item.id}
                    className="mb-2 flex items-center justify-between"
                  >
                    <span>{item.title}</span>
                    <div>
                      <span className="mr-2">${item.price.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <Button className="mt-4 w-full">Checkout</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
