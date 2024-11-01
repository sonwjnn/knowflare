import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateCategory } from '@/features/admin/categories/api/use-create-category'
import { Loader2, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const CreateForm = () => {
  const router = useRouter()
  const { mutate: createCategory, isPending: createCategoryLoading } =
    useCreateCategory()
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    createCategory(
      {
        name,
      },
      {
        onSuccess: () => {
          router.push('/admin/categories')
        },
      }
    )
  }

  if (createCategoryLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-8">
        <div className="pt-8">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
            <div className="sm:col-span-2">
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <Button type="submit" disabled={createCategoryLoading}>
            {createCategoryLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
