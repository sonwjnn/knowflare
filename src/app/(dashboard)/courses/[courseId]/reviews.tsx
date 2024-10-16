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
import { useCreateReview } from '@/features/reviews/api/use-create-review'
import { useGetReviews } from '@/features/reviews/api/use-get-reviews'
import { useCourseId } from '@/hooks/use-course-id'
import { useCurrentUser } from '@/hooks/use-current-user'
import { format } from 'date-fns'
import { Star } from 'lucide-react'
import { useState } from 'react'

import { ReviewItem } from './review-item'

export const Reviews = () => {
  const currentUser = useCurrentUser()
  const courseId = useCourseId()

  const { data: reviews, isPending: reviewsLoading } = useGetReviews(courseId)
  const { mutate: createReview, isPending: createReviewLoading } =
    useCreateReview()

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

  if (reviewsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="mb-4 border-b pb-4 last:border-b-0">
              <div className="mb-2 flex items-center">
                <Skeleton className="mr-2 h-10 w-10" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews?.length === 0 && (
          <div className="flex h-10 items-center justify-center">
            This course has no reviews yet.
          </div>
        )}
        {reviews?.map(item => (
          <ReviewItem
            key={item.id}
            id={item.id}
            content={item.content || ''}
            rating={item.rating}
            username={item.user.name || ''}
            canDelete={item.user.id === currentUser?.id}
            timestamp={format(new Date(item.createdAt!), 'd MMM yyyy, HH:mm')}
          />
        ))}
      </CardContent>
      <CardFooter>
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
                onChange={e => setContent(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button disabled={createReviewLoading} type="submit">
              Submit Review
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  )
}
