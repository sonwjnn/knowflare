import { protectServer } from '@/features/auth/utils'

import { Footer } from './footer'
import Navbar from './navbar'
import Sidebar from './sidebar'

const DashboradLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      {/* <div className="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
        <Sidebar />
      </div>  */}
      <main className="min-h-screen bg-slate-50">{children}</main>
      <Footer />
    </div>
  )
}

export default DashboradLayout
