import { Badge } from '@/components/ui/badge'
import { lessons } from '@/db/schema'
import { useGetLessons } from '@/features/admin/lessons/api/use-get-lessons'
import { useChapterId } from '@/hooks/use-chapter-id'
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

interface LessonsListProps {
  onReorder: (updateData: { id: string; position: number }[]) => void
  onEdit: (id: string) => void
}
const LessonsList = ({ onReorder, onEdit }: LessonsListProps) => {
  const courseId = useCourseId()
  const chapterId = useChapterId()
  const { data: lessonsData, isPending: lessonsLoading } = useGetLessons({
    courseId,
    chapterId,
  })
  const [lessons, setLessons] = useState(lessonsData ?? [])

  useEffect(() => {
    setLessons(lessonsData ?? [])
  }, [lessonsData])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(lessons)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    const updatedLessons = items.slice(startIndex, endIndex + 1)

    setLessons(items)

    const bulkUpdateData = updatedLessons.map(lesson => ({
      id: lesson.id,
      position: items.findIndex(item => item.id === lesson.id),
    }))

    onReorder(bulkUpdateData)
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lessons">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {lessons.map((lesson, index) => (
              <Draggable index={index} key={lesson.id} draggableId={lesson.id}>
                {provided => (
                  <div
                    className={cn(
                      'mb-4 flex items-center gap-x-2 rounded-none border bg-white text-sm text-slate-700',
                      lesson.isPublished &&
                        'border-sky-200 bg-sky-100 text-sky-700'
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        'rounded-l-md border-r border-slate-200 px-2 py-3 transition hover:bg-slate-300',
                        lesson.isPublished &&
                          'border-r-sky-200 hover:bg-sky-200'
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>

                    <span>{lesson.title}</span>

                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      {/* {lesson.isFree && <Badge>Free</Badge>} */}

                      <Badge
                        className={cn(
                          'bg-slate-500',
                          lesson.isPublished && 'bg-sky-700'
                        )}
                      >
                        {lesson.isPublished ? 'Published' : 'Draft'}
                      </Badge>

                      <Pencil
                        onClick={() => onEdit(lesson.id)}
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

export default LessonsList
