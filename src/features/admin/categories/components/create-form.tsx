import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateCategory } from '@/features/admin/categories/api/use-create-category'
import { useCreateCategoryModal } from '@/features/admin/categories/store/use-create-category-modal'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const CreateForm = () => {
  const router = useRouter()
  const { mutate: createCategory, isPending: createCategoryLoading } =
    useCreateCategory()
  const [_, setOpen] = useCreateCategoryModal()
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    createCategory(
      {
        name,
      },
      {
        onSuccess: () => {
          // router.push('/admin/categories')
          setOpen(false)
        },
      }
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
                  disabled={createCategoryLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <Button type="submit" disabled={createCategoryLoading}>
            Create
          </Button>
        </div>
      </div>
    </form>
  )
}
