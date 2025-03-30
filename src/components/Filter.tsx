'use client'

import { Category } from '@/payload-types'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function Filter({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  const handleFilter = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }

    router.push(`/list?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-2">
        <h3 className="text-lg mb-2">Categories</h3>
        <select
          className="w-full ring-1 ring-gray-400 rounded px-2 py-1"
          value={searchParams.get('cat') || ''}
          onChange={(e) => handleFilter('cat', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug || ''}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value)
              handleFilter('minPrice', e.target.value)
            }}
            className="w-full text-xs rounded-lg px-3 py-2 ring-1 ring-gray-400"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value)
              handleFilter('maxPrice', e.target.value)
            }}
            className="w-full text-xs rounded-lg px-3 py-2 ring-1 ring-gray-400"
          />
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Sort By</h3>
        <select
          onChange={(e) => handleFilter('sort', e.target.value)}
          value={searchParams.get('sort') || ''}
          className="w-full ring-1 ring-gray-400 rounded px-2 py-1"
        >
          <option value="">Default</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Date Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Date</h3>
        <select
          onChange={(e) => handleFilter('date', e.target.value)}
          value={searchParams.get('date') || ''}
          className="w-full ring-1 ring-gray-400 rounded px-2 py-1"
        >
          <option value="">Default</option>
          <option value="new">Newest First</option>
          <option value="old">Oldest First</option>
        </select>
      </div>
    </div>
  )
}
