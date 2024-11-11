'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Globe, MapPin, Github, Twitter, LinkedinIcon } from 'lucide-react'
import { User } from 'next-auth'

interface ProfileItemProps {
  user: User & {
    bio?: string
    location?: string
    website?: string
    github?: string
    twitter?: string
    linkedin?: string
  }
}

export const ProfileItem = ({ user }: ProfileItemProps) => {
  const enhancedUser = {
    ...user,
    bio: user.bio || "Senior Full-stack Developer passionate about creating elegant solutions to complex problems. Experienced in React, TypeScript, and Cloud Architecture. Currently building innovative web applications and contributing to open-source projects.",
    location: user.location || "San Francisco, CA",
    website: user.website || "https://johndoe.dev",
    github: user.github || "johndoe",
    twitter: user.twitter || "johndoe",
    linkedin: user.linkedin || "https://linkedin.com/in/johndoe",
  }

  return (
    <Card className="overflow-hidden bg-white">
      {/* Header Banner */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400" />
      
      <div className="px-6 pb-6">
        {/* Profile Section */}
        <div className="relative flex flex-col items-center">
          {/* Avatar */}
          <Avatar className="absolute -top-16 size-32 ring-4 ring-white">
            <AvatarImage 
              src={enhancedUser.image || ''} 
              alt={enhancedUser.name || ''} 
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-3xl text-white">
              {enhancedUser.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Profile Info */}
          <div className="mt-20 w-full space-y-4">
            {/* Name and Email */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">{enhancedUser.name}</h2>
              <p className="text-sm text-gray-500">{enhancedUser.email}</p>
            </div>

            {/* Bio */}
            {enhancedUser.bio && (
              <p className="text-center text-sm leading-relaxed text-gray-600">
                {enhancedUser.bio}
              </p>
            )}

            {/* Location and Website */}
            <div className="flex flex-wrap justify-center gap-4">
              {enhancedUser.location && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="size-4" />
                  <span>{enhancedUser.location}</span>
                </div>
              )}
              
              {enhancedUser.website && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Globe className="size-4" />
                  <a 
                    href={enhancedUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 hover:underline"
                  >
                    {enhancedUser.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-6">
              {enhancedUser.github && (
                <a
                  href={`https://github.com/${enhancedUser.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-full bg-gray-100 p-2 transition-colors hover:bg-blue-50"
                >
                  <Github className="size-5 text-gray-600 transition-colors group-hover:text-blue-600" />
                </a>
              )}
              {enhancedUser.twitter && (
                <a
                  href={`https://twitter.com/${enhancedUser.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-full bg-gray-100 p-2 transition-colors hover:bg-blue-50"
                >
                  <Twitter className="size-5 text-gray-600 transition-colors group-hover:text-blue-600" />
                </a>
              )}
              {enhancedUser.linkedin && (
                <a
                  href={enhancedUser.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-full bg-gray-100 p-2 transition-colors hover:bg-blue-50"
                >
                  <LinkedinIcon className="size-5 text-gray-600 transition-colors group-hover:text-blue-600" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
