'use client'

export default function EditLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto flex-grow px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">{children}</div>
    </div>
  )
}
