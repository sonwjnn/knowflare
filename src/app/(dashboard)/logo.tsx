import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href="/" className="flex flex-shrink-0 items-center">
      <span className="ml-2 text-2xl font-bold text-gray-800">Knowflare</span>
    </Link>
  )
}

export default Logo
