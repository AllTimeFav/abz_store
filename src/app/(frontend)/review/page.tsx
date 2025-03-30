'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SingleProductReview from '@/components/Reviews/SingleProductReview'
import MultiProductReview from '@/components/Reviews/MultiProductReview'

function ReviewPageContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const productId = searchParams.get('product')
  const email = searchParams.get('user')

  if (orderId && productId) {
    return <SingleProductReview orderId={orderId} productId={productId} email={email || ''} />
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

export default function ReviewPage() {
  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <ReviewPageContent />
    </Suspense>
  )
}
