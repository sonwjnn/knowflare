'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowRight, Book, Home, Search, Users, Video } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement your search logic here
    console.log('Searching for:', searchQuery)
  }

  const quickLinks = [
    { icon: Book, text: 'Courses', href: '/courses' },
    { icon: Video, text: 'Lectures', href: '/lectures' },
    { icon: Users, text: 'Study Groups', href: '/groups' },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="relative mb-6 h-40 w-full">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-primary/10"></div>
              <div className="absolute -bottom-64 -right-64 h-96 w-96 rounded-full bg-secondary/10"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl font-bold text-primary/20">404</span>
            </div>
          </div>
          <CardTitle className="text-center text-3xl font-bold">
            Oops! Page Not Found
          </CardTitle>
          <CardDescription className="mt-2 text-center text-lg">
            We couldn&apos;t find the page you&apos;re looking for. Let&apos;s
            get you back on track!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search for content..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-grow rounded-none"
              />
              <Button type="submit" variant="secondary">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {quickLinks.map((link, index) => (
                <Link key={index} href={link.href}>
                  <Button variant="outline" className="w-full justify-start">
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.text}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="link" className="text-primary">
                <Home className="mr-2 h-4 w-4" />
                Back to Homepage
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
