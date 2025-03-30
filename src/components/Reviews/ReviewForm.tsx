import { Star } from 'lucide-react'
import { useState } from 'react'

// Reusable form component
export default function ReviewForm({
  onSubmit,
  initialRating,
  initialTitle,
  initialContent,
  isSubmitting,
}: {
  onSubmit: (rating: number, title: string, content: string) => void
  initialRating: number
  initialTitle: string
  initialContent: string
  isSubmitting: boolean
}) {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(rating, title, content)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
  )
}
