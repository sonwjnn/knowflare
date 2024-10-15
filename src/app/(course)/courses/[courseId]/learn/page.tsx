'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronRight, PlayCircle } from 'lucide-react'
import { useState } from 'react'
import ReactPlayer from 'react-player'

const courseOutline = [
  {
    title: 'Introduction to the Course',
    lessons: ['Course Overview', 'Setting Up Your Environment'],
  },
  {
    title: 'Basic Concepts',
    lessons: ['Variables and Data Types', 'Control Structures', 'Functions'],
  },
  {
    title: 'Advanced Topics',
    lessons: [
      'Object-Oriented Programming',
      'Error Handling',
      'Asynchronous Programming',
    ],
  },
]

export default function LearnPage() {
  const [expandedSections, setExpandedSections] = useState<number[]>([])

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full overflow-y-auto bg-muted p-4 lg:w-64">
        <h2 className="mb-4 text-xl font-bold">Course Outline</h2>
        {courseOutline.map((section, index) => (
          <div key={index} className="mb-4">
            <Button
              variant="ghost"
              className="w-full justify-start font-semibold"
              onClick={() => toggleSection(index)}
            >
              {expandedSections.includes(index) ? (
                <ChevronDown className="mr-2 h-4 w-4" />
              ) : (
                <ChevronRight className="mr-2 h-4 w-4" />
              )}
              {section.title}
            </Button>
            {expandedSections.includes(index) && (
              <ul className="ml-6 mt-2 space-y-2">
                {section.lessons.map((lesson, lessonIndex) => (
                  <li key={lessonIndex}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {lesson}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8">
        <h1 className="mb-6 text-3xl font-bold">Learn React Fundamentals</h1>
        <div className="mb-6 aspect-video">
          <ReactPlayer
            url="https://utfs.io/f/4e0834ac-eb2a-4e9f-8ae0-11522785c3ca-oz682y.mp4"
            width="100%"
            height="100%"
            controls
          />
        </div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This comprehensive course will teach you the fundamentals of
              React, from basic concepts to advanced topics. By the end of this
              course, you&apos;ll be able to build complex, interactive web
              applications using React.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Lesson: Introduction to React</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              In this lesson, we&apos;ll cover the basics of React, including
              components, JSX, and the virtual DOM. You&apos;ll learn how to
              create your first React application and understand the core
              concepts that make React so powerful.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
