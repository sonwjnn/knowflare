'use client'

import { List } from './list'
import { Summary } from './summary'

export default function CartPage() {
  return (
    <main className="max-w-8xl mx-auto mt-16 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-2/3">
          <List />
        </div>

        <div className="lg:w-1/3">
          <Summary />
        </div>
      </div>
    </main>
  )
}
