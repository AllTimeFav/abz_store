'use client'
import { getColorName } from '@/utils/colorMap'
import { useState, useEffect, useMemo, useCallback } from 'react'
import SizeSelector from './SizeSelector'
import ColorSelector from './ColorSelector'
import { useCartStore } from '@/store/cart'
import { QuantitySelector } from '../QuantitySelector'
import SaveCart from '@/store/saveCart'
import { Product } from '@/payload-types'

interface Props {
  product: Product
}

type ColorOption = {
  color: string
  pricing?: {
    price?: number | null
    onSale?: boolean | null
    discount?: number | null
    discountedPrice?: number | null
  }
  trackInventory?: boolean | null
  quantity?: number | null
  id?: string | null
}

type SizeOption = {
  value: string
  pricing?: {
    price?: number | null
    onSale?: boolean | null
    discount?: number | null
    discountedPrice?: number | null
  }
  trackInventory?: boolean | null
  quantity?: number | null
  id?: string | null
}

type CombinationOption = {
  combination: {
    color: string
    colorLabel?: string | null
    size: string
  }
  pricing?: {
    price?: number | null
    onSale?: boolean | null
    discount?: number | null
    discountedPrice?: number | null
  }
  trackInventory?: boolean | null
  quantity?: number | null
  id?: string | null
}

export default function CustomizeProduct({ product }: Props) {
  const options = product.options
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
  const availableColors = useMemo(() => {
    return hasCombinations
      ? Array.from(new Set(options?.combinations?.map((c) => c.combination.color)))
      : options?.colors?.map((c) => c.color) || []
  }, [hasCombinations, options?.combinations, options?.colors])

  const availableSizes = useMemo(() => {
    return hasCombinations
      ? Array.from(new Set(options?.combinations?.map((c) => c.combination.size)))
      : options?.sizes?.map((s) => s.value) || []
  }, [hasCombinations, options?.combinations, options?.sizes])

  // Check if a combination exists
  const isCombinationAvailable = useCallback(
    (color: string, size: string) => {
      return (
        options?.combinations?.some(
          (c: CombinationOption) => c.combination.color === color && c.combination.size === size,
        ) || false
      )
    },
    [options?.combinations],
  )

  // Get combination details if exists
  const getCombinationStock = useCallback(
    (color: string, size: string) => {
      const combo = options?.combinations?.find(
        (c: CombinationOption) => c.combination.color === color && c.combination.size === size,
      )
      return combo?.trackInventory ? combo.quantity || 0 : 999
    },
    [options?.combinations],
  )

  // Function to get price and stock for color-only selection
  const getColorDetails = useCallback(
    (color: string) => {
      const colorVariant = options?.colors?.find((v: ColorOption) => v.color === color)
      return {
        price: colorVariant?.pricing?.discountedPrice || colorVariant?.pricing?.price || 0,
        stock: colorVariant?.trackInventory ? colorVariant.quantity || 0 : 999,
      }
    },
    [options?.colors],
  )

  // Function to get price and stock for size-only selection
  const getSizeDetails = useCallback(
    (size: string) => {
      const sizeVariant = options?.sizes?.find((v: SizeOption) => v.value === size)
      return {
        price: sizeVariant?.pricing?.discountedPrice || sizeVariant?.pricing?.price || 0,
        stock: sizeVariant?.trackInventory ? sizeVariant.quantity || 0 : 999,
      }
    },
    [options?.sizes],
  )

  // Function to get price and stock for color-size combination
  const getCombinationDetails = useCallback(
    (color: string, size: string) => {
      const combination = options?.combinations?.find(
        (combo: CombinationOption) =>
          combo.combination.color === color && combo.combination.size === size,
      )
      return {
        price: combination?.pricing?.discountedPrice || combination?.pricing?.price || 0,
        stock: combination?.trackInventory ? combination.quantity || 0 : 999,
      }
    },
    [options?.combinations],
  )

  // Update selection and details
  const updateSelection = useCallback(
    (newColor?: string | null, newSize?: string | null) => {
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
    },
    [
      hasCombinations,
      hasColors,
      hasSizes,
      isCombinationAvailable,
      getCombinationDetails,
      getColorDetails,
      getSizeDetails,
    ],
  )

  // Initialize first option
  useEffect(() => {
    const initializeSelection = () => {
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
    }

    initializeSelection()
  }, [options, hasColors, hasCombinations, hasSizes, updateSelection])

  // Handle color selection
  const handleColorSelect = (color: string) => {
    updateSelection(color, selectedSize)
  }

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    updateSelection(selectedColor, size)
  }

  const getSelectedVariant = useCallback(() => {
    if (hasCombinations && selectedColor && selectedSize) {
      return options?.combinations?.find(
        (c: CombinationOption) =>
          c.combination.color === selectedColor && c.combination.size === selectedSize,
      )
    } else if (hasColors && selectedColor) {
      return options?.colors?.find((c: ColorOption) => c.color === selectedColor)
    } else if (hasSizes && selectedSize) {
      return options?.sizes?.find((s: SizeOption) => s.value === selectedSize)
    }
    return null
  }, [hasCombinations, hasColors, hasSizes, selectedColor, selectedSize, options])

  const getVariantPrice = useCallback(() => {
    const variant = getSelectedVariant()
    return variant?.pricing?.discountedPrice || variant?.pricing?.price || 0
  }, [getSelectedVariant])

  const handleAddToCart = async () => {
    const variant = getSelectedVariant()
    const variantPrice = getVariantPrice()
    const imageUrl =
      typeof product.images?.[0]?.image === 'string'
        ? product.images[0].image
        : product.images?.[0]?.image?.url || ''

    addItem({
      id: product.id,
      name: product.name,
      price: variantPrice,
      image: imageUrl,
      quantity,
      color: selectedColor ? getColorName(selectedColor) : undefined,
      size: selectedSize || undefined,
      maxQuantity: variant?.trackInventory ? variant.quantity : undefined,
    })
    await SaveCart()
  }

  const isValidCombination = useCallback(() => {
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
  }, [hasCombinations, hasColors, hasSizes, selectedColor, selectedSize, isCombinationAvailable])

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
              {getColorName(selectedColor)} - {selectedSize?.toUpperCase()}
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
