"use client"

import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { StarIcon } from 'lucide-react'
import { Id } from '@/convex/_generated/dataModel'

export default function ReviewsPage() {
  const { documentId } = useParams()
  const document = useQuery(api.documents.getById, {
    documentId: documentId as Id<"documents">
  })
  const reviews = useQuery(api.reviews.getByDocumentId, {
    documentId: documentId as Id<"documents">
  })
  const [searchTerm, setSearchTerm] = useState<string>("")

  const filteredReviews = reviews?.filter(review =>
    review.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (!document) {
    return <div>Loading document...</div>
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-4">Отзывы для {document.title}</h2>
      <input
        type="text"
        placeholder="Поиск отзывов..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md"
      />
      {!reviews ? (
        Array(3).fill(0).map((_, index) => <SkeletonReview key={index} />)
      ) : filteredReviews.length === 0 ? (
        <p>Нет отзывов для этого документа.</p>
      ) : (
        filteredReviews.map((review) => (
          <Card key={review._id} className="mb-4">
            <CardContent className="pt-4">
              <div className="flex items-center mb-2">
                <span className="font-semibold mr-2">{review.author}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
              <p>{review.content}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

function SkeletonReview() {
  return (
    <Card className="overflow-hidden mb-4">
      <CardContent className="p-4">
        <Skeleton className="w-3/4 h-6 mb-2" />
        <Skeleton className="w-full h-4 mb-4" />
        <Skeleton className="w-full h-10" />
      </CardContent>
    </Card>
  )
}