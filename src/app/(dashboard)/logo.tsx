import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href="/" className="flex flex-shrink-0 items-center">
      <span className="sr-only">Knowflare</span>
      <span
        className="text-3xl font-extrabold text-primary"
        style={{
          fontFamily: "'Bungee Shade', cursive",
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.05))',
        }}
      >
        Knowflare
      </span>
    </Link>
  )
}

export default Logo
