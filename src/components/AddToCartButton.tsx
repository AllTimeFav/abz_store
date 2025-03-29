'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { QuantitySelector } from './QuantitySelector'
import SaveCart from '@/store/saveCart'

export function AddToCartButton({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = useState(1)
  const maxQuantity = product.inventory?.trackInventory ? product.inventory.quantity : 10

  const handleAddToCart = async () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.pricing.onSale ? product.pricing.discountedPrice : product.pricing.price,
      image: product.images[0].image.url,
      quantity,
      maxQuantity: product.inventory?.trackInventory ? product.inventory.quantity : undefined,
    })
    await SaveCart()
  }

  return (
    <div className="space-y-4">
      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        maxQuantity={maxQuantity}
        showStock={product.inventory?.trackInventory}
      />
      <button
        onClick={handleAddToCart}
        className="w-full py-3 px-4 bg-black cursor-pointer text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300"
        disabled={product.inventory?.trackInventory && product.inventory.quantity === 0}
      >
        Add to Cart
      </button>
    </div>
  )
}
