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
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <h2 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-3xl font-bold text-transparent">
                Knowflare
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-gray-300">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Necessitatibus commodi nam cum ab quibusdam recusandae tempore.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map(link => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="transform text-gray-400 transition-all duration-300 hover:scale-110 hover:text-white"
                    aria-label={link.name}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                )
              })}
            </div>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="space-y-6">
              <h3 className="relative text-lg font-semibold">
                {title}
                <span className="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-blue-500"></span>
              </h3>
              <ul className="space-y-4">
                {items.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group relative text-gray-400 transition-colors duration-300 hover:text-white"
                    >
                      <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-12"></div>
                      <span className="inline-block translate-x-0 transform transition-transform duration-300 group-hover:translate-x-4">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-gray-700 pt-8">
          <div className="flex flex-col items-center space-y-6 md:flex-row md:justify-between md:space-y-0">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Knowflare, Inc. All rights
              reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {[
                'Privacy Policy',
                'Terms of Use',
                'Cookies Policy',
                'Cookie Preferences',
                'Ethics Line',
                'Accessibility',
              ].map(item => (
                <Link
                  key={item}
                  href="#"
                  className="text-sm text-gray-400 transition-colors duration-300 hover:text-white"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
