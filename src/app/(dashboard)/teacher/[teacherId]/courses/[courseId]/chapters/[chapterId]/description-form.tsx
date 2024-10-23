import { Editor } from '@/components/editor'
import { Preview } from '@/components/preview'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { chapters } from '@/db/schema'
import { useEditChapter } from '@/features/chapters/api/use-edit-chapter'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  description: z.string().min(1),
})

interface ChapterDescriptionFormProps {
  initialData: typeof chapters.$inferInsert
  courseId: string
  chapterId: string
}

const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps) => {
  const { mutate: editMutation, isPending } = useEditChapter(chapterId)

  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => {
    setIsEditing(current => !current)
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: initialData?.description || '' },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    editMutation(values, {
      onSuccess: () => {
        toggleEdit()
      },
    })
  }
  return (
    <div className="mt-6 rounded-none border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter Description
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'mt-2 text-sm',
            !initialData?.description && 'italic text-slate-500'
          )}
        >
          {!initialData?.description && 'No description'}
          {initialData?.description && (
            <Preview value={initialData?.description} />
          )}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isPending} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default ChapterDescriptionForm
