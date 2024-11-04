'use client'

import { useBulkDeleteUsers } from '@/features/admin/users/api/use-bulk-delete-users'
import { useGetUsers } from '@/features/admin/users/api/use-get-users'
import { Loader2 } from 'lucide-react'

import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'

export default function Users() {
  const { data: users, isPending: usersLoading } = useGetUsers()
  const { mutate: deleteUsers } = useBulkDeleteUsers()

  if (usersLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const normalizeUsers = (users ?? []).map(user => ({
    ...user,
    emailVerified: user?.emailVerified ? new Date(user.emailVerified) : null,
  }))

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your tasks for this month!
          </p>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable
          data={normalizeUsers}
          columns={columns}
          onDelete={row => {
            const ids = row.map(r => r.original.id)
            deleteUsers({ ids })
          }}
        />
      </div>
    </>
  )
}
