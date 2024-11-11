import { Sidebar } from './sidebar'

const DashboradLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-16 flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50 p-6">{children}</main>
    </div>
  )
}

export default DashboradLayout
