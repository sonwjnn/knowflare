import Link from 'next/link'
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'

const links = {
  Explore: [
    { name: 'Products', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Staff picks', href: '#' },
    { name: 'Product demo', href: '#' },
  ],
  Company: [
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Partners', href: '#' },
    { name: 'Newsletter', href: '#' },
  ],
  Support: [
    { name: 'Help Center', href: '#' },
    { name: 'House Rules', href: '#' },
    { name: 'Content Guidelines', href: '#' },
  ],
}

const socialLinks = [
  { name: 'YouTube', href: '#', icon: FaYoutube },
  { name: 'Facebook', href: '#', icon: FaFacebook },
  { name: 'Pinterest', href: '#', icon: FaPinterest },
  { name: 'Instagram', href: '#', icon: FaInstagram },
  { name: 'Twitter', href: '#', icon: FaTwitter },
  { name: 'LinkedIn', href: '#', icon: FaLinkedin },
  { name: 'TikTok', href: '#', icon: FaTiktok },
]

export const Footer = () => {
  return (
    <footer className="bg-[#2d2f31] text-white">
      <div className="max-w-8xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <h2 className="mb-4 text-2xl font-bold">Knowflare</h2>
            <p className="text-md text mb-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Necessitatibus commodi nam cum ab quibusdam recusandae tempore.
            </p>
            <div className="mt-4 flex space-x-4">
              {socialLinks.map(link => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-white hover:text-gray-300"
                    aria-label={link.name}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                )
              })}
            </div>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="mb-4 text-lg font-semibold">{title}</h3>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm hover:text-gray-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-sm">
            &copy; 2024 Knowflare, Inc. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <Link href="#" className="text-sm hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm hover:text-gray-300">
              Terms of Use
            </Link>
            <Link href="#" className="text-sm hover:text-gray-300">
              Cookies Policy
            </Link>
            <Link href="#" className="text-sm hover:text-gray-300">
              Cookie Preferences
            </Link>
            <Link href="#" className="text-sm hover:text-gray-300">
              Ethics Line
            </Link>
            <Link href="#" className="text-sm hover:text-gray-300">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
