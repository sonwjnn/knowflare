import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEditCategory } from '@/features/admin/categories/api/use-edit-category'
import { useGetCategory } from '@/features/admin/categories/api/use-get-category'
import { useCategoryId } from '@/features/admin/categories/hooks/use-category-id'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const EditForm = () => {
  const router = useRouter()
  const categoryId = useCategoryId()
  const { data: category, isPending: categoryLoading } =
    useGetCategory(categoryId)
  const { mutate: editCategory, isPending: editCategoryLoading } =
    useEditCategory(categoryId)
  const [name, setName] = useState(category?.name || '')

  useEffect(() => {
    if (category) {
      setName(category.name)
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    editCategory(
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

  if (categoryLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!category) return null

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
          <Button type="submit" disabled={editCategoryLoading}>
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  )
}
