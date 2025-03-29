'use client'

import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { Cart } from '@/components/Cart'
import { useState } from 'react'

export function CartIcon({ isTransparent }: { isTransparent: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const totalItems = useCartStore((state) => state.totalItems)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isTransparent
            ? 'lg:text-white lg:hover:text-gray-700'
            : 'text-gray-700 hover:text-gray-900'
        } p-2 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-gray-700`}
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <Cart />
        </div>
      )}
    </div>
  )
}
