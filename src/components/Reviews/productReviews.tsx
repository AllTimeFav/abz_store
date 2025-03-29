// components/reviews/ProductReviews.tsx
'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { Review } from '@/payload-types'
import Image from 'next/image'

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/productRev/${productId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch reviews')
        }

        const data = await response.json()
        setReviews(data.docs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [productId])

  if (loading) return <div className="text-center py-8">Loading reviews...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>
  if (reviews.length === 0) return <div className="text-center py-8">No reviews yet</div>

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Customer Reviews</h2>

      <div className="space-y-8">
        {reviews
          .filter((review) => review.approved) // Only show approved reviews
          .map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-4">
                {/* User avatar with first letter of email */}
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium">
                    {review.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{review.title}</h3>
                    {review.verifiedPurchase && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {review.email?.split('@')[0] || 'Anonymous'} •{' '}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>

                  <p className="mt-2 text-gray-700">{review.content}</p>

                  {/* Review images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {review.images.map((image, idx) => (
                        <div key={idx} className="h-20 w-20 rounded overflow-hidden">
                          <img
                            src={image.image.url || ''}
                            alt={`Review image ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
