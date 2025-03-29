const SizeSelector = ({
  sizes,
  selectedSize,
  onSizeSelect,
  selectedColor,
  hasCombinations,
  isCombinationAvailable,
}: {
  sizes: string[]
  selectedSize: string | null
  onSizeSelect: (size: string) => void
  selectedColor: string | null
  hasCombinations: boolean
  isCombinationAvailable: (color: string, size: string) => boolean
}) => {
  // Return null if no sizes are provided or sizes array is empty
  if (!sizes || sizes.length === 0) return null

  return (
    <div>
      <h4 className="font-medium text-sm mb-2">Choose Size</h4>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isAvailable =
            !selectedColor || !hasCombinations || isCombinationAvailable(selectedColor, size)

          return (
            <button
              key={size}
              className={`px-4 py-2 border rounded transition-all ${
                selectedSize === size
                  ? 'border-black bg-black text-white'
                  : isAvailable
                    ? 'border-gray-300 hover:border-gray-400'
                    : 'border-gray-200 opacity-40 cursor-not-allowed'
              }`}
              onClick={() => isAvailable && onSizeSelect(size)}
              disabled={!isAvailable}
            >
              {size.toUpperCase()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SizeSelector
