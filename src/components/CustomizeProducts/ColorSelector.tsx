import { getColorName } from '@/utils/colorMap'

const ColorSelector = ({
  colors,
  selectedColor,
  onColorSelect,
  selectedSize,
  hasCombinations,
  isCombinationAvailable,
}: {
  colors: string[]
  selectedColor: string | null
  onColorSelect: (color: string) => void
  selectedSize: string | null
  hasCombinations: boolean
  isCombinationAvailable: (color: string, size: string) => boolean
}) => (
  <div>
    <h4 className="font-medium text-sm mb-2">Choose Color</h4>
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => {
        const isAvailable =
          !selectedSize || !hasCombinations || isCombinationAvailable(color, selectedSize)

        return (
          <button
            key={color}
            className={`w-8 h-8 border-2 rounded-full transition-all ${
              selectedColor === color
                ? 'border-black ring-2 ring-gray-200'
                : isAvailable
                  ? 'border-gray-300 hover:border-gray-400'
                  : 'border-gray-200 opacity-40 cursor-not-allowed'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => isAvailable && onColorSelect(color)}
            disabled={!isAvailable}
          >
            <span className="sr-only">{getColorName(color)}</span>
          </button>
        )
      })}
    </div>
  </div>
)
export default ColorSelector
