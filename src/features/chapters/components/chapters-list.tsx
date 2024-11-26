import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { useGetCurrentPurchase } from '@/features/purchases/api/use-get-current-purchases'
import { useCourseId } from '@/hooks/use-course-id'
import { useLessonId } from '@/hooks/use-lesson-id'
import { cn } from '@/lib/utils'
import { ChevronUp, Clock, BookOpen, Lock, CheckCircle, PlayCircle, Video, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'

import { LessonItem } from './lesson-item'

export const ChaptersList = () => {
    const courseId = useCourseId()
    const lessonId = useLessonId()

    const { data: chapters, isPending: chaptersLoading } =
        useGetChapters(courseId)

    const { data: purchase, isPending: purchaseLoading } =
        useGetCurrentPurchase(courseId)

    const [expandedChapters, setExpandedChapters] = useState<string[]>([])

    const toggleChapter = (chapterId: string) => {
        setExpandedChapters(prev =>
            prev.includes(chapterId)
                ? prev.filter(id => id !== chapterId)
                : [...prev, chapterId]
        )
    }
    useEffect(() => {
        if (lessonId && chapters) {
            const activeChapter = chapters.find(chapter =>
                chapter.lessons.some(lesson => lesson.id === lessonId)
            )
            if (activeChapter && !expandedChapters.includes(activeChapter.id)) {
                toggleChapter(activeChapter.id)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chapters])

    if (!chapters) return null

    const totalLessons = chapters.reduce(
        (total, chapter) => total + chapter.lessons.length,
        0
    )
    const completedLessons = chapters.reduce(
        (completed, chapter) =>
            completed + chapter.lessons.filter(lesson => lesson.isCompleted).length,
        0
    )

    const calculateProgress =
        totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

    return (
        <div className="flex h-full flex-col bg-white">
            <div className="border-b border-slate-200 px-6 py-6 bg-slate-50/80">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-slate-800">
                        Course Content
                    </h2>
                    <div className="bg-white px-4 py-1.5 rounded-full border border-slate-200">
                        <span className="text-sm font-medium text-slate-600">
                            {chapters.length} sections • {totalLessons} lectures
                        </span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-slate-700">Progress</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">
                            {Math.round(calculateProgress)}%
                        </span>
                    </div>
                    <Progress
                        value={calculateProgress}
                        className="h-2 bg-slate-100"
                        indicatorClassName="bg-blue-600"
                    />
                    <div className="mt-2 text-sm text-slate-500 text-right">
                        {completedLessons} of {totalLessons} lessons completed
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="divide-y divide-slate-100">
                    {chapters?.map((chapter, chapterIndex) => (
                        <Collapsible
                            key={chapter.id}
                            open={expandedChapters.includes(chapter.id)}
                            onOpenChange={() => toggleChapter(chapter.id)}
                        >
                            <CollapsibleTrigger
                                className={cn(
                                    'w-full text-left px-6 py-4',
                                    'hover:bg-slate-50 transition-all duration-200',
                                    'focus:outline-none',
                                    chapter.lessons.some(lesson => lesson.id === lessonId) &&
                                    'bg-blue-50/60 border-l-4 border-blue-500'
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-medium">
                                            {chapterIndex + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800">{chapter.title}</h3>
                                            <p className="text-sm text-slate-500 mt-0.5">
                                                {chapter.lessons.length} lectures • {chapter.lessons.filter(l => l.isCompleted).length} completed
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronUp
                                        className={cn(
                                            'w-5 h-5 text-slate-400 transition-transform duration-200',
                                            !expandedChapters.includes(chapter.id) && 'rotate-180'
                                        )}
                                    />
                                </div>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                                <div className="bg-slate-50/50">
                                    {chapter.lessons.map((lesson, lessonIndex) => (
                                        <div
                                            key={lesson.id}
                                            className={cn(
                                                'px-6 py-3 transition-colors duration-200',
                                                lesson.id === lessonId ?
                                                    'bg-white border-l-4 border-blue-500' :
                                                    'hover:bg-slate-50 border-l-4 border-transparent',
                                                lessonIndex !== chapter.lessons.length - 1 && 'border-b border-slate-100'
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                                    {lesson.isCompleted ? (
                                                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        </div>
                                                    ) : !purchase && !lesson.isFree ? (
                                                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                                                            <Lock className="w-4 h-4 text-orange-500" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                                            {lesson.lessonType === 'video' ? (
                                                                <Video className="w-4 h-4 text-blue-600" />
                                                            ) : (
                                                                <FileText className="w-4 h-4 text-blue-600" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    {!purchase && !lesson.isFree && (
                                                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-600 rounded mb-1">
                                                            Premium
                                                        </span>
                                                    )}
                                                    <LessonItem
                                                        id={lesson.id}
                                                        title={lesson.title}
                                                        lessonType={lesson.lessonType}
                                                        isActive={lesson.id === lessonId}
                                                        isCompleted={!!lesson.isCompleted}
                                                        isLocked={!purchase && !lesson.isFree}

                                                    />
                                                </div>

                                                <span className="text-sm text-slate-500">
                                                    {lesson.lessonType === 'video' ? '10:00' : '5 min read'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
