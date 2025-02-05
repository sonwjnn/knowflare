import { Footer } from './footer'
import Navbar from './navbar'

const DashboradLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />

      <main className="min-h-screen bg-slate-50">{children}</main>
      <Footer />
    </div>
  )
}

export default DashboradLayout
