import { Badge } from '@/components/ui/badge'
import { chapters } from '@/db/schema'
import { useGetChapters } from '@/features/admin/chapters/api/use-get-chapters'
import { useCourseId } from '@/hooks/use-course-id'
import { cn } from '@/lib/utils'
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd'
import { Grip, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ChaptersListProps {
  onReorder: (updateData: { id: string; position: number }[]) => void
  onEdit: (id: string) => void
}
const ChaptersList = ({ onReorder, onEdit }: ChaptersListProps) => {
  const courseId = useCourseId()
  const { data: chaptersData, isPending: chaptersLoading } =
    useGetChapters(courseId)
  const [chapters, setChapters] = useState(chaptersData ?? [])

  useEffect(() => {
    setChapters(chaptersData ?? [])
  }, [chaptersData])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(chapters)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    const updatedChapters = items.slice(startIndex, endIndex + 1)

    setChapters(items)

    const bulkUpdateData = updatedChapters.map(chapter => ({
      id: chapter.id,
      position: items.findIndex(item => item.id === chapter.id),
    }))

    onReorder(bulkUpdateData)
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable
                index={index}
                key={chapter.id}
                draggableId={chapter.id}
              >
                {provided => (
                  <div
                    className={cn(
                      'mb-4 flex items-center gap-x-2 rounded-none border bg-white text-sm text-slate-700',
                      chapter.isPublished &&
                        'border-sky-200 bg-sky-100 text-sky-700'
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        'rounded-l-md border-r border-slate-200 px-2 py-3 transition hover:bg-slate-300',
                        chapter.isPublished &&
                          'border-r-sky-200 hover:bg-sky-200'
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>

                    <span>{chapter.title}</span>

                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      {/* {chapter.isFree && <Badge>Free</Badge>} */}

                      <Badge
                        className={cn(
                          'bg-slate-500',
                          chapter.isPublished && 'bg-sky-700'
                        )}
                      >
                        {chapter.isPublished ? 'Published' : 'Draft'}
                      </Badge>

                      <Pencil
                        onClick={() => onEdit(chapter.id)}
                        className="h-4 w-4 cursor-pointer transition hover:opacity-75"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default ChaptersList
