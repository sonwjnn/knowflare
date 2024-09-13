'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateCourse } from '@/features/courses/api/use-create-course'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const CreatePage = () => {
  const router = useRouter()

  const [title, setTitle] = useState('')

  const { mutate, isPending } = useCreateCourse()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate(
      { title },
      {
        onSuccess: ({ data }) => {
          toast.success('Course created')
          router.push(`/teacher/courses/${data.id}`)
        },
        onError: () => {
          toast.error('Failed to create course')
        },
      }
    )
  }

  return (
    <div className="mx-auto flex h-full max-w-5xl p-6 md:items-center md:justify-center">
      <div>
        <h1 className="text-2xl"> Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry you can
          chnage it later
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Course Title
          </div>
          <Input
            name="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. 'Advanced Web Development'"
          />
          <p className="text-sm text-muted-foreground">
            what will you teach in this course?
          </p>
          <div className="flex items-center gap-x-2">
            <Link href="/">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isPending}>
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePage
