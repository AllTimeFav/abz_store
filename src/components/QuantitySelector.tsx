'use client'

interface QuantityProps {
  quantity: number
  setQuantity: (quantity: number) => void
  maxQuantity: number
  showStock?: boolean
}

export function QuantitySelector({ quantity, setQuantity, maxQuantity, showStock }: QuantityProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="px-3 py-1 border rounded-lg disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          -
        </button>
        <span className="w-12 text-center">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
          disabled={quantity >= maxQuantity}
          className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          +
        </button>
      </div>
      {showStock && maxQuantity > 0 && (
        <span className="text-sm text-gray-500">
          {maxQuantity < 10 && `Only ${maxQuantity} items left!`}
        </span>
      )}
    </div>
  )
}
