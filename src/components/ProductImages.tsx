'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Media } from '@/payload-types' // Import the Media type from Payload

interface ProductImage {
  image?: string | Media | null // Make it match Payload's type
  altText?: string | null
  id?: string | null
  _id?: string
  [key: string]: unknown
}

const ProductImages = ({ items }: { items: ProductImage[] }) => {
  const [index, setIndex] = useState(0)

  if (!items || items.length === 0) {
    return <p>No images available</p>
  }

  // Helper function to get image URL with proper type checking
  const getImageUrl = (item: ProductImage): string => {
    if (!item.image) return '/product.png'

    // Handle string case
    if (typeof item.image === 'string') return item.image

    // Handle Media case with proper null checks
    return item.image.url || '/product.png'
  }

  // Helper function to get alt text
  const getAltText = (item: ProductImage): string => {
    return item.altText || 'Product Image'
  }

  return (
    <div>
      {/* Main Image */}
      <div className="h-[500px] relative">
        <Image
          src={getImageUrl(items[index])}
          alt={getAltText(items[index])}
          fill
          priority
          sizes="50vw"
          className="object-cover rounded-md"
          placeholder="blur"
          blurDataURL={getImageUrl(items[index])}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex justify-between gap-4 mt-8">
        {items.map((item, i) => (
          <div
            className={`w-1/4 h-32 relative cursor-pointer ${index === i ? 'ring-2 ring-primary' : ''}`}
            key={item._id || item.id || i}
            onClick={() => setIndex(i)}
          >
            <Image
              src={getImageUrl(item)}
              alt={getAltText(item)}
              fill
              sizes="30vw"
              className="object-cover rounded-md"
              loading="lazy"
              placeholder="blur"
              blurDataURL={getImageUrl(item)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductImages
