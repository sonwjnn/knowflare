'use client'

import { Layout } from '@/components/custom/layout'
import { EditForm } from '@/features/admin/categories/components/edit-form'
import { UserButton } from '@/features/auth/components/user-button'

export default function EditUser() {
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <div className="ml-auto flex items-center space-x-4">
          {/* <ThemeSwitch /> */}
          <UserButton />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className="container mx-auto flex-grow px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <EditForm />
          </div>
        </div>
      </Layout.Body>
    </Layout>
  )
}
