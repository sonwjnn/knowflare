'use client'

import { EditForm } from '@/features/admin/categories/components/edit-form'

export default function EditUser() {
  return (
    <div className="container mx-auto flex-grow px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <EditForm />
      </div>
    </div>
  )
}
