import { protectAdmin } from '@/features/admin/utils'

type AdminLayoutProps = {
  children: React.ReactNode
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  await protectAdmin()

  return <>{children}</>
}

export default AdminLayout
