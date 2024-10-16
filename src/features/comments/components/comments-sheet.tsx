import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { insertCommentsSchema } from '@/db/schema'
import { useCommentsSheet } from '@/features/comments/store/use-comments-sheet'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'

type CommentsSheetProps = {}

const formSchema = insertCommentsSchema.omit({
  id: true,
})

type FormValues = z.input<typeof formSchema>

export const CommentsSheet = ({}: CommentsSheetProps) => {
  const [open, setOpen] = useCommentsSheet()

  const onSubmit = (values: FormValues) => {}

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="min-w-full space-y-4 lg:min-w-[800px]">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>

        {/* {isLoading ? (
          <div className="absolute inset-0 items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            categoryOptions={categoryOptions}
            onCreateAccount={onCreateAccount}
          />
        )} */}
        <SheetDescription></SheetDescription>
      </SheetContent>
    </Sheet>
  )
}
