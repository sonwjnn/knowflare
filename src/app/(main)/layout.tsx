import { Navbar } from './navbar'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-full bg-muted">
      <div className="flex h-full flex-col lg:pl-[300px]">
        <Navbar />
        <main className="flex-1 overflow-auto bg-white p-8 lg:rounded-tl-2xl">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
