'use client'

import Image from 'next/image'
import { useState } from 'react'

const ProductImages = ({ items }: { items: any[] }) => {
  const [index, setIndex] = useState(0)

  if (!items || items.length === 0) {
    return <p>No images available</p>
  }

  return (
    <div>
      {/* Main Image */}
      <div className="h-[500px] relative">
        <Image
          src={items[index]?.image?.url || '/product.png'}
          alt="Product Image"
          fill
          priority
          sizes="50vw"
          className="object-cover rounded-md"
          placeholder="blur"
          blurDataURL={items[index]?.image?.url || '/product.png'}
        />
      </div>

      {/* Thumbnails */}
      <div className="flex justify-between gap-4 mt-8">
        {items.map((item: any, i: number) => (
          <div
            className="w-1/4 h-32 relative cursor-pointer"
            key={item._id || i}
            onClick={() => setIndex(i)}
          >
            <Image
              src={item.image?.url || '/product.png'}
              alt="Thumbnail"
              fill
              sizes="30vw"
              className="object-cover rounded-md"
              loading="lazy"
              placeholder="blur"
              blurDataURL={item.image?.url || '/product.png'}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductImages
