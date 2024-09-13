"use client"

import { useParams } from 'next/navigation'
import { useMutation, useQuery } from "convex/react"
import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import Link from "next/link"

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Toolbar } from "@/components/toolbar"
import { Cover } from "@/components/cover"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ReviewsPage from "@/app/(public)/components/review"
import ReviewForm from "@/app/(public)/components/submit"
interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">
  }
}

interface Review {
  id: string
  author: string
  content: string
  rating: number
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), [])

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId
  })

  const update = useMutation(api.documents.update)

  
  const onChange = (content: string) => {
    update({
      id: params.documentId,
      content
    })
  }

  const [reviews, setReviews] = useState<Review[]>([
    { id: "1", author: "John Doe", content: "Great document!", rating: 5 },
    { id: "2", author: "Jane Smith", content: "Very informative.", rating: 4 }
  ])

  const [newReview, setNewReview] = useState({ author: "", content: "", rating: 5 })

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const review = { ...newReview, id: Date.now().toString() }
    setReviews([...reviews, review])
    setNewReview({ author: "", content: "", rating: 5 })
  }

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return <div>Not found</div>
  }

  return (
    <div className="pb-40">
      <Cover preview url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        
        <Toolbar preview initialData={document} />
        <Editor editable={false} onChange={onChange} initialContent={document.content} />
        
        <ReviewForm/>
        
        <ReviewsPage/>
      </div>
    </div>
  )
}

export default DocumentIdPage