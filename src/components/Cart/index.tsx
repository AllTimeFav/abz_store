'use client'

import { ShoppingCart, X } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

interface CartProps {
  isCheckoutPage?: boolean
}

export function Cart({ isCheckoutPage = false }: CartProps) {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCartStore()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
        <p className="mt-4 text-gray-600 font-medium">Your cart is empty</p>
        <p className="mt-2 text-sm text-gray-500">Add some products to your cart</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {/* Header - Only show if not on checkout page */}
      {!isCheckoutPage && (
        <div className="p-4 bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="font-medium">Shopping Cart ({totalItems})</h2>
          </div>
        </div>
      )}

      {/* Items */}
      <div className={`${isCheckoutPage ? 'p-0' : 'p-4'} max-h-[60vh] overflow-auto space-y-6`}>
        {items.map((item) => (
          <div
            key={`${item.id}-${item.color}-${item.size}`}
            className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0"
          >
            <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="100"
                className="object-cover object-center"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                  <div className="mt-1 text-sm text-gray-500 space-y-1">
                    {item.color && <p>Color: {item.color}</p>}
                    {item.size && <p>Size: {item.size.toUpperCase()}</p>}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id, item.color, item.size)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value), item.color, item.size)
                    }
                    className="rounded border p-1 text-sm"
                  >
                    {Array.from({ length: item.maxQuantity || 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500">× {item.price}Rs</span>
                </div>
                <p className="font-medium">{item.price * item.quantity}Rs</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer - Only show if not on checkout page */}
      {!isCheckoutPage && (
        <div className="p-4 bg-gray-50 space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Subtotal</p>
              <p className="font-medium">{totalPrice}Rs</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Shipping</p>
              <p className="font-medium">Calculated at checkout</p>
            </div>
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between font-medium">
              <p>Total</p>
              <p>{totalPrice}Rs</p>
            </div>
          </div>
          <Button
            onClick={() => router.push('/checkout')}
            className="w-full rounded-lg bg-black py-3 text-white cursor-pointer hover:bg-gray-800 transition-colors"
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  )
}
