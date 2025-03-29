// components/reviews/MultiProductReview.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ReviewForm } from './ReviewForm'

interface OrderItem {
  id: string
  product: {
    id: string
    title: string
    image?: {
      url: string
    }
  }
  quantity: number
  price: number
  color?: string
  size?: string
  reviewed?: boolean
}

export default function MultiProductReview({ orderId }: { orderId: string }) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error' | null
  }>({ message: '', type: null })
  const router = useRouter()

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/items`)
        if (!res.ok) throw new Error('Failed to fetch order items')
        const data = await res.json()

        // Check which items already have reviews
        const itemsWithReviewStatus = await Promise.all(
          data.items.map(async (item: any) => {
            const reviewRes = await fetch(
              `/api/reviews?product=${item.product.id}&order=${orderId}`,
            )
            const reviewData = await reviewRes.json()
            return {
              ...item,
              reviewed: reviewData.totalDocs > 0,
            }
          }),
        )

        setOrderItems(itemsWithReviewStatus)
      } catch (error) {
        setNotification({
          message: 'Failed to load order details',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrderItems()
  }, [orderId])

  const handleNext = () => {
    if (currentProductIndex < orderItems.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1)
    } else {
      setCompleted(true)
      setTimeout(() => {
        router.push(`/orders/${orderId}`)
      }, 3000)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const handleSubmit = async (rating: number, title: string, content: string) => {
    try {
      const currentItem = orderItems[currentProductIndex]

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: currentItem.product.id,
          order: orderId,
          rating,
          title,
          content,
          verifiedPurchase: true,
        }),
      })

      if (!response.ok) throw new Error('Submission failed')

      setNotification({
        message: 'Review submitted successfully!',
        type: 'success',
      })

      // Mark as reviewed and move to next
      const updatedItems = [...orderItems]
      updatedItems[currentProductIndex].reviewed = true
      setOrderItems(updatedItems)

      setTimeout(handleNext, 1500)
    } catch (error) {
      setNotification({
        message: 'Failed to submit review. Please try again.',
        type: 'error',
      })
    }
  }

  if (loading)
    return <div className="container mx-auto py-8 text-center">Loading order details...</div>

  if (completed)
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Thank you for your reviews!</h1>
        <p>You'll be redirected to your order page shortly.</p>
      </div>
    )

  if (orderItems.length === 0)
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">No products to review</h1>
        <p>This order doesn't contain any products that need reviewing.</p>
      </div>
    )

  const currentItem = orderItems[currentProductIndex]
  const progress = ((currentProductIndex + 1) / orderItems.length) * 100
  const reviewedCount = orderItems.filter((item) => item.reviewed).length

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Review Your Order</h1>

      {notification.type && (
        <div
          className={`mb-4 p-4 rounded-md ${
            notification.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <div className="flex justify-between mb-2">
          <span>
            Item {currentProductIndex + 1} of {orderItems.length}
          </span>
          <span>{reviewedCount} reviewed</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden mb-6">
        <div className="p-4 bg-white">
          <div className="flex gap-4">
            {currentItem.product.image && (
              <img
                src={currentItem.product.image.url}
                alt={currentItem.product.title}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div>
              <h3 className="font-medium">{currentItem.product.title}</h3>
              <p className="text-sm text-gray-600">Quantity: {currentItem.quantity}</p>
              {currentItem.color && (
                <p className="text-sm text-gray-600">Color: {currentItem.color}</p>
              )}
              {currentItem.size && (
                <p className="text-sm text-gray-600">Size: {currentItem.size}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <ReviewForm
            onSubmit={handleSubmit}
            initialRating={0}
            initialTitle=""
            initialContent=""
            isSubmitting={false}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleSkip}
          disabled={currentProductIndex >= orderItems.length - 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Skip This Item
        </button>
        {currentProductIndex < orderItems.length - 1 && (
          <button onClick={handleNext} className="px-4 py-2 text-blue-600">
            Next Item
          </button>
        )}
      </div>
    </div>
  )
}
