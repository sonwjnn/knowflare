import { protectAdmin } from '@/features/admin/utils'

import { Wrapper } from './wrapper'

type AdminLayoutProps = {
  children: React.ReactNode
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  await protectAdmin()

  return <Wrapper>{children}</Wrapper>
}

export default AdminLayout
