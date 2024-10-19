import Link from 'next/link'

const links = {
  Knowflare: [
    { name: 'About', href: '#' },
    { name: 'What We Offer', href: '#' },
    { name: 'Leadership', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Catalog', href: '#' },
  ],
  Community: [
    { name: 'Learners', href: '#' },
    { name: 'Partners', href: '#' },
    { name: 'Developers', href: '#' },
    { name: 'Beta Testers', href: '#' },
    { name: 'Translators', href: '#' },
  ],
  More: [
    { name: 'Press', href: '#' },
    { name: 'Investors', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Help', href: '#' },
  ],
}

export const Footer = () => {
  return (
    <footer className="bg-[#2d2f31] text-white">
      <div className="max-w-8xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="mb-4 font-semibold">{title}</h3>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm hover:underline">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="mb-4 font-semibold">Mobile App</h3>
            {/* <Image
              src="/placeholder.svg?height=120&width=160"
              alt="Download on the App Store"
              width={160}
              height={120}
              className="mb-2"
            />
            <Image
              src="/placeholder.svg?height=120&width=160"
              alt="Get it on Google Play"
              width={160}
              height={120}
            /> */}
          </div>
        </div>
        <div className="mt-8 border-t border-gray-400 pt-8">
          <p className="text-sm text-white">
            &copy; 2024 Knowflare Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
