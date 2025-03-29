// app/review/page.tsx
'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import SingleProductReview from '@/components/Reviews/SingleProductReview'
import MultiProductReview from '@/components/reviews/MultiProductReview'

export default function ReviewPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const productId = searchParams.get('product')
  const email = searchParams.get('user')

  if (orderId && productId) {
    return <SingleProductReview orderId={orderId} productId={productId} email={email} />
  }

  if (orderId) {
    return <MultiProductReview orderId={orderId} />
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Review Products</h1>
      <p>No valid review link provided.</p>
    </div>
  )
}
