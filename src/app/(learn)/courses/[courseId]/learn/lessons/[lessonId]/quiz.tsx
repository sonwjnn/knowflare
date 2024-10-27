'use client'

import { Button } from '@/components/ui/button'
import { useGetLesson } from '@/features/lessons/api/use-get-lesson'
import { useCourseId } from '@/hooks/use-course-id'
import { useLessonId } from '@/hooks/use-lesson-id'
import { Check } from 'lucide-react'
import { useState } from 'react'

interface QuizOption {
  id: string
  text: string
}

const quizOptions: QuizOption[] = [
  { id: 'A', text: 'Eiusmod Tempor Incididunt Ut' },
  { id: 'B', text: 'Fugiat Nulla Pariatur' },
  { id: 'C', text: 'Voluptatem Accusantium Doloremque' },
  { id: 'D', text: 'Totam Rem Aperiam' },
]

export default function QuizComponent() {
  const courseId = useCourseId()
  const lessonId = useLessonId()

  const { data: lesson, isPending: lessonLoading } = useGetLesson({
    lessonId,
    courseId,
  })
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId)
  }

  const handleSubmit = () => {
    if (selectedOption) {
      console.log(`Submitted answer: ${selectedOption}`)
      // Here you would typically send the answer to a server or process it
    }
  }

  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-md flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-xl font-semibold">
        Reprehenderit In Voluptate Velit Esse Cillum Dolore
      </h1>
      <div className="space-y-2">
        {quizOptions.map(option => (
          <Button
            key={option.id}
            variant="outline"
            className={`w-full justify-between ${
              selectedOption === option.id ? 'border-green-500' : ''
            }`}
            onClick={() => handleOptionClick(option.id)}
          >
            <span>{option.text}</span>
            {selectedOption === option.id && (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </Button>
        ))}
      </div>
      <Button
        className="mt-4 w-full bg-green-500 text-white hover:bg-green-600"
        onClick={handleSubmit}
        disabled={!selectedOption}
      >
        Submit Answer
      </Button>
    </div>
  )
}
