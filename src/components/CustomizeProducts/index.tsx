'use client'
import { getColorName } from '@/utils/colorMap'
import { useState, useEffect } from 'react'
import SizeSelector from './SizeSelector'
import ColorSelector from './ColorSelector'
import { useCartStore } from '@/store/cart'
import { QuantitySelector } from '../QuantitySelector'
import SaveCart from '@/store/saveCart'

interface Props {
  product: any
  options: any
}

export default function CustomizeProduct({ product, options }: Props) {
  const hasColors = (options?.colors?.length || 0) > 0
  const hasSizes = (options?.sizes?.length || 0) > 0
  const hasCombinations = (options?.combinations?.length || 0) > 0

  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [availableStock, setAvailableStock] = useState<number>(0)

  const addItem = useCartStore((state) => state.addItem)

  // Get available colors and sizes from combinations
  const availableColors = hasCombinations
    ? Array.from(new Set(options.combinations?.map((c: any) => c.combination.color)))
    : options.colors?.map((c: any) => c.color) || []

  const availableSizes = hasCombinations
    ? Array.from(new Set(options.combinations?.map((c: any) => c.combination.size)))
    : options.sizes?.map((s: any) => s.value) || []

  // Check if a combination exists
  const isCombinationAvailable = (color: string, size: string) => {
    return (
      options.combinations?.some(
        (c: any) => c.combination.color === color && c.combination.size === size,
      ) || false
    )
  }

  // Get combination details if exists
  const getCombinationStock = (color: string, size: string) => {
    const combo = options.combinations?.find(
      (c: any) => c.combination.color === color && c.combination.size === size,
    )
    return combo?.trackInventory ? combo.quantity : 999
  }

  // Function to get price and stock for color-only selection
  const getColorDetails = (color: string) => {
    const colorVariant = options?.colors?.find((v: any) => v.color === color)
    return {
      price: colorVariant?.pricing.discountedPrice || colorVariant?.pricing.price || 0,
      stock: colorVariant?.trackInventory ? colorVariant.quantity : 999,
    }
  }

  // Function to get price and stock for size-only selection
  const getSizeDetails = (size: string) => {
    const sizeVariant = options?.sizes?.find((v: any) => v.value === size)
    return {
      price: sizeVariant?.pricing.discountedPrice || sizeVariant?.pricing.price || 0,
      stock: sizeVariant?.trackInventory ? sizeVariant.quantity : 999,
    }
  }

  // Function to get price and stock for color-size combination
  const getCombinationDetails = (color: string, size: string) => {
    const combination = options?.combinations?.find(
      (combo: any) => combo.combination.color === color && combo.combination.size === size,
    )
    return {
      price: combination?.pricing.discountedPrice || combination?.pricing.price || 0,
      stock: combination?.trackInventory ? combination.quantity : 999,
    }
  }

  // Update selection and details
  const updateSelection = (newColor?: string | null, newSize?: string | null) => {
    // Don't update if invalid combination
    if (hasCombinations && newColor && newSize && !isCombinationAvailable(newColor, newSize)) {
      return
    }

    if (newColor !== undefined) setSelectedColor(newColor)
    if (newSize !== undefined) setSelectedSize(newSize)

    let details = { price: 0, stock: 0 }

    if (hasCombinations) {
      // Check combinations first if they exist
      if (newColor && newSize) {
        details = getCombinationDetails(newColor, newSize)
      }
    } else if (hasColors && hasSizes) {
      // If no combinations but both colors and sizes exist
      if (newColor && newSize) {
        const colorDetails = getColorDetails(newColor)
        const sizeDetails = getSizeDetails(newSize)
        details = {
          price: (colorDetails.price || 0) + (sizeDetails.price || 0),
          stock: Math.min(colorDetails.stock, sizeDetails.stock),
        }
      }
    } else if (hasColors && newColor) {
      // Only colors available
      details = getColorDetails(newColor)
    } else if (hasSizes && newSize) {
      // Only sizes available
      details = getSizeDetails(newSize)
    }

    setCurrentPrice(details.price || null)
    setAvailableStock(details.stock)
    setQuantity(1)
  }

  // Initialize first option
  useEffect(() => {
    if (hasCombinations) {
      const firstCombo = options?.combinations?.[0]?.combination
      if (firstCombo) {
        updateSelection(firstCombo.color, firstCombo.size)
      }
    } else if (hasColors && !hasSizes) {
      updateSelection(options?.colors?.[0]?.color, null)
    } else if (!hasColors && hasSizes) {
      updateSelection(null, options?.sizes?.[0]?.value)
    } else if (hasColors && hasSizes) {
      updateSelection(options?.colors?.[0]?.color, options?.sizes?.[0]?.value)
    }
  }, [options])

  // Handle color selection
  const handleColorSelect = (color: string) => {
    updateSelection(color, selectedSize)
  }

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    updateSelection(selectedColor, size)
  }

  const handleAddToCart = async () => {
    const selectedVariant = getSelectedVariant()
    const variantPrice = getVariantPrice()

    addItem({
      id: product.id,
      name: product.name,
      price: variantPrice,
      image: product.images[0].image.url,
      quantity,
      color: getColorName(selectedColor || ''),
      size: selectedSize,
      maxQuantity: selectedVariant?.trackInventory ? selectedVariant.quantity : undefined,
    })
    await SaveCart()
  }

  const getSelectedVariant = () => {
    if (hasCombinations && selectedColor && selectedSize) {
      return options.combinations?.find(
        (c: any) => c.combination.color === selectedColor && c.combination.size === selectedSize,
      )
    } else if (hasColors && selectedColor) {
      return options.colors?.find((c: any) => c.color === selectedColor)
    } else if (hasSizes && selectedSize) {
      return options.sizes?.find((s: any) => s.value === selectedSize)
    }
    return null
  }

  const getVariantPrice = () => {
    const variant = getSelectedVariant()
    return variant?.pricing.discountedPrice || variant?.pricing.price || 0
  }

  const getMaxQuantity = () => {
    const variant = getSelectedVariant()
    return variant?.trackInventory ? variant.quantity : 999
  }

  const isValidCombination = () => {
    // If combinations exist, need both color and size
    if (hasCombinations) {
      return selectedColor && selectedSize && isCombinationAvailable(selectedColor, selectedSize)
    }

    // If only colors exist, need color
    if (hasColors && !hasSizes) {
      return selectedColor !== null
    }

    // If only sizes exist, need size
    if (!hasColors && hasSizes) {
      return selectedSize !== null
    }

    // If both exist but no combinations, need both
    if (hasColors && hasSizes) {
      return selectedColor !== null && selectedSize !== null
    }

    return false
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Colors Section */}
      {availableColors.length > 0 && (
        <ColorSelector
          colors={availableColors}
          selectedColor={selectedColor}
          onColorSelect={handleColorSelect}
          selectedSize={selectedSize}
          hasCombinations={hasCombinations}
          isCombinationAvailable={isCombinationAvailable}
        />
      )}

      {/* Sizes Section */}
      {availableSizes.length > 0 && (
        <SizeSelector
          sizes={availableSizes}
          selectedSize={selectedSize}
          onSizeSelect={handleSizeSelect}
          selectedColor={selectedColor}
          hasCombinations={hasCombinations}
          isCombinationAvailable={isCombinationAvailable}
        />
      )}

      {/* Combination Info */}
      {selectedColor && selectedSize && (
        <div className="text-sm bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium">Selected Combination</h4>
          <div className="flex items-center gap-2 mt-1">
            <div
              className="w-4 h-4 rounded-full border shadow-sm"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="font-medium">
              {getColorName(selectedColor)} - {selectedSize.toUpperCase()}
            </span>
            {hasCombinations && (
              <span className="text-gray-500">
                (Only {getCombinationStock(selectedColor, selectedSize)} left!)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Price and Stock Display */}
      {currentPrice !== null && <div className="text-lg font-medium">Price: {currentPrice} Rs</div>}

      {/* Quantity Selection */}
      {availableStock > 0 && (
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
          maxQuantity={availableStock}
          showStock={true}
        />
      )}

      {/* Add to Cart Button */}
      <div className="space-y-4">
        <button
          onClick={handleAddToCart}
          disabled={!isValidCombination() || availableStock === 0}
          className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300"
        >
          {availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
