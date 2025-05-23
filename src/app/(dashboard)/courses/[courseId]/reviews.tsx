import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useGetCurrentPurchase } from '@/features/purchases/api/use-get-current-purchases'
import { useCreateReview } from '@/features/reviews/api/use-create-review'
import { useGetReviews } from '@/features/reviews/api/use-get-reviews'
import { useCourseId } from '@/hooks/use-course-id'
import { useCurrentUser } from '@/hooks/use-current-user'
import { format } from 'date-fns'
import { Loader2, Star } from 'lucide-react'
import { useState } from 'react'

import { ReviewItem } from './review-item'

export const Reviews = () => {
  const currentUser = useCurrentUser()
  const courseId = useCourseId()

  const { data: reviews, isPending: reviewsLoading } = useGetReviews(courseId)
  const { mutate: createReview, isPending: createReviewLoading } =
    useCreateReview()
  const { data: currentPurchase, isPending: currentPurchaseLoading } =
    useGetCurrentPurchase(courseId)

  const [content, setContent] = useState<string>('')
  const [rating, setRating] = useState<number>(0)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    createReview(
      {
        content,
        rating,
        courseId,
      },
      {
        onSuccess: () => {
          setContent('')
          setRating(0)
        },
      }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit(e as any)
    }
  }

  if (reviewsLoading) {
    return (
      <div className="flex h-full min-h-48 w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const currentReview = reviews?.some(item => item.user.id === currentUser?.id)

  const canReview = !!currentPurchase && !currentReview

  return (
    <Card className="border-none shadow-none">
      <CardContent>
        {reviews?.length === 0 && (
          <div className="flex h-full min-h-48 w-full flex-col items-center justify-center gap-4">
            <p className="text-lg text-gray-500">
              This course has no reviews yet.
            </p>
          </div>
        )}
        {reviews?.map(item => (
          <ReviewItem
            key={item.courseId}
            id={item.courseId}
            content={item.content || ''}
            rating={item.rating}
            username={item.user.name || ''}
            canDelete={item.user.id === currentUser?.id}
            timestamp={format(new Date(item.date!), 'd MMM yyyy, HH:mm')}
          />
        ))}
      </CardContent>
      <CardFooter>
        {canReview && (
          <form onSubmit={onSubmit} className="w-full">
            <h4 className="mb-2 text-lg font-semibold">Write a Review</h4>
            <div className="space-y-4">
              <div>
                <RadioGroup
                  id="rating"
                  disabled={createReviewLoading}
                  className="flex space-x-1"
                  value={rating.toString()}
                  onValueChange={value => setRating(+value)}
                >
                  {[1, 2, 3, 4, 5].map(value => (
                    <div key={value} className="flex items-center">
                      <RadioGroupItem
                        value={value.toString()}
                        id={`rating-${value}`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`rating-${value}`}
                        className="cursor-pointer"
                        onMouseEnter={() => setRating(value)}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            value <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Textarea
                  id="comment"
                  disabled={createReviewLoading}
                  placeholder="Write your review here..."
                  value={content}
                  onKeyDown={handleKeyDown}
                  onChange={e => setContent(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button disabled={createReviewLoading} type="submit">
                Submit Review
              </Button>
            </div>
          </form>
        )}
      </CardFooter>
    </Card>
  )
}
