'use client'

import { CreateForm } from '@/features/admin/categories/components/create-form'

export default function CreateCategory() {
  return (
    <div className="container mx-auto flex-grow px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <CreateForm />
      </div>
    </div>
  )
}
