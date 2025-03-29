// components/reviews/SingleProductReview.tsx
'use client'

import { useState, useRef } from 'react'
import { Star, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SingleProductReview({
  orderId,
  productId,
  email,
}: {
  orderId: string
  productId: string
  email: string
}) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error' | null
  }>({ message: '', type: null })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 5 - images.length)
      setImages([...images, ...newFiles])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rating || !title || !content) {
      setNotification({ message: 'Please fill all fields', type: 'error' })
      return
    }

    setIsSubmitting(true)
    setNotification({ message: '', type: null })

    try {
      const formData = new FormData()
      formData.append('product', productId)
      formData.append('order', orderId)
      formData.append('email', email)
      formData.append('rating', rating.toString())
      formData.append('title', title)
      formData.append('content', content)
      formData.append('verifiedPurchase', 'true')

      images.forEach((file, index) => {
        formData.append(`images-${index}`, file)
      })

      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Submission failed')

      setNotification({
        message: 'Thank you for your review! Redirecting...',
        type: 'success',
      })

      setTimeout(() => {
        router.push(`/`)
      }, 2000)
    } catch (error) {
      setNotification({
        message: 'Failed to submit review. Please try again.',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Leave a Review</h1>

      <div className="mb-4 p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          You're reviewing a product from your order #{orderId}
        </p>
      </div>

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

      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <div className="flex">
            {[...Array(5)].map((_, i) => {
              const ratingValue = i + 1
              return (
                <button
                  key={i}
                  type="button"
                  className="p-1"
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                >
                  <Star
                    className={`h-6 w-6 ${
                      ratingValue <= (hover || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Review
          </label>
          <textarea
            id="content"
            rows={4}
            className="w-full p-2 border rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Images (optional)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 5}
            className="flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-md text-sm"
          >
            <Upload className="h-4 w-4" />
            {images.length >= 5 ? 'Maximum 5 images' : 'Add Images'}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md text-white ${
            isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
