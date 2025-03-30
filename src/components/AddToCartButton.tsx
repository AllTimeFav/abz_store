'use client'

import { useState } from 'react'
import { CartItem, useCartStore } from '@/store/cart'
import { QuantitySelector } from './QuantitySelector'
import SaveCart from '@/store/saveCart'
import { Product } from '@/payload-types'

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = useState(1)
  const maxQuantity = product.inventory?.trackInventory ? product.inventory.quantity || 0 : 10

  const handleAddToCart = async () => {
    // Helper function to get the image URL
    const getImageUrl = () => {
      if (!product.images?.[0]?.image) return ''

      const firstImage = product.images[0].image
      return typeof firstImage === 'string' ? firstImage : firstImage.url || ''
    }

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price:
        product.pricing?.onSale && product.pricing.discountedPrice
          ? product.pricing.discountedPrice
          : product.pricing?.price || 0,
      image: getImageUrl(),
      quantity,
      maxQuantity: product.inventory?.trackInventory ? product.inventory.quantity : null,
    }

    addItem(cartItem)
    await SaveCart()
  }

  return (
    <div className="space-y-4">
      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        maxQuantity={maxQuantity}
        showStock={product.inventory?.trackInventory || false}
      />
      <button
        onClick={handleAddToCart}
        className="w-full py-3 px-4 bg-black cursor-pointer text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300"
        disabled={(product.inventory?.trackInventory && product.inventory.quantity === 0) || false}
      >
        Add to Cart
      </button>
    </div>
  )
}
