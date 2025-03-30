import config from '@payload-config'
import { Star, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { Button } from './ui/button'
import { Product } from '@/payload-types'

const PRODUCTS_PER_PAGE = 9

interface ProductListProps {
  limit?: number
  ribbon?: string
  searchParams?: {
    cat?: string
    minPrice?: string
    maxPrice?: string
    sort?: 'asc' | 'desc'
    date?: 'new' | 'old'
    ribbon?: string
    search?: string
  }
}

type PriceFilter = {
  greater_than?: number
  less_than?: number
}

type FilterClause = {
  'categories.slug'?: { equals: string }
  'options.combinations.pricing.price'?: PriceFilter
  'options.colors.pricing.price'?: PriceFilter
  'options.sizes.pricing.price'?: PriceFilter
  ribbon?: { equals: string }
  slug?: { contains: string }
}

type WhereClause = {
  and?: Array<FilterClause | { or: FilterClause[] }>
}

const getProductPrice = (product: Product) => {
  // Check for base pricing first
  if (product.pricing?.price) {
    return product.pricing.onSale ? product.pricing.discountedPrice : product.pricing.price
  }

  // Check for variants
  const hasColors = product.options?.colors && product.options?.colors?.length > 0
  const hasSizes = product.options?.sizes && product.options?.sizes?.length > 0
  const hasCombinations = product.options?.combinations && product.options?.combinations?.length > 0

  // If combinations exist and both colors and sizes are present
  if (hasCombinations) {
    const combination = product.options?.combinations && product.options?.combinations[0]

    return combination?.pricing?.onSale
      ? combination.pricing.discountedPrice
      : combination?.pricing?.price
  }

  // If only colors exist
  if (hasColors && !hasSizes) {
    const color = product.options?.colors && product.options?.colors[0]
    return color?.pricing?.onSale ? color.pricing.discountedPrice : color?.pricing?.price
  }

  // If only sizes exist
  if (hasSizes && !hasColors) {
    const size = product.options?.sizes && product.options.sizes[0]
    return size?.pricing?.onSale ? size.pricing.discountedPrice : size?.pricing?.price
  }

  return 0 // Fallback price
}

const ProductList = async ({ limit, ribbon, searchParams }: ProductListProps) => {
  const waitedParams = await searchParams
  const payload = await getPayload({ config: config })

  // Build where clause
  const where: WhereClause = {
    and: [
      // Category filter
      ...(waitedParams?.cat
        ? [
            {
              'categories.slug': {
                equals: waitedParams.cat,
              },
            },
          ]
        : []),

      // Price filter
      ...(waitedParams?.minPrice || waitedParams?.maxPrice
        ? [
            {
              or: [
                {
                  'options.combinations.pricing.price': {
                    ...(waitedParams.minPrice
                      ? { greater_than: parseInt(waitedParams.minPrice) }
                      : {}),
                    ...(waitedParams.maxPrice
                      ? { less_than: parseInt(waitedParams.maxPrice) }
                      : {}),
                  },
                },
                {
                  'options.colors.pricing.price': {
                    ...(waitedParams.minPrice
                      ? { greater_than: parseInt(waitedParams.minPrice) }
                      : {}),
                    ...(waitedParams.maxPrice
                      ? { less_than: parseInt(waitedParams.maxPrice) }
                      : {}),
                  },
                },
                {
                  'options.sizes.pricing.price': {
                    ...(waitedParams.minPrice
                      ? { greater_than: parseInt(waitedParams.minPrice) }
                      : {}),
                    ...(waitedParams.maxPrice
                      ? { less_than: parseInt(waitedParams.maxPrice) }
                      : {}),
                  },
                },
              ],
            },
          ]
        : []),

      // Ribbon filter
      ...(ribbon ? [{ ribbon: { equals: ribbon } }] : []),
      ...(waitedParams?.ribbon ? [{ ribbon: { equals: waitedParams.ribbon } }] : []),
      // Search filter
      ...(waitedParams?.search
        ? [
            {
              slug: {
                contains: waitedParams.search,
              },
            },
          ]
        : []),
    ],
  }

  // Build sort options
  const sort: string[] = waitedParams?.sort
    ? [
        'options.combinations.pricing.discountedPrice',
        'options.colors.pricing.discountedPrice',
        'options.sizes.pricing.discountedPrice',
        waitedParams.sort,
      ]
    : waitedParams?.date
      ? ['createdAt', waitedParams.date === 'new' ? '-1' : '1']
      : []

  const payloadProduct = await payload.find({
    collection: 'products',
    where,
    sort,
    depth: 1,
    limit: limit || PRODUCTS_PER_PAGE,
  })

  const products = payloadProduct.docs
  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <h2 className="text-3xl font-semibold text-gray-700 text-center">No Products Found</h2>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          // Safely get category name
          const firstCategory = product.categories?.[0]
          const categoryName =
            typeof firstCategory === 'object' ? firstCategory?.name : firstCategory || ''

          // Safely get image URL
          const getImageUrl = (image?: { image?: string | { url?: string | null } | null }) => {
            if (!image?.image) return '/product.png'
            return typeof image.image === 'string'
              ? image.image
              : image.image?.url || '/product.png'
          }

          return (
            <div key={product.id} className="group">
              <Link
                className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md h-full flex flex-col"
                href={`/${product.slug}`}
              >
                <div className="relative">
                  <div className="absolute top-2 px-2 py-1 rounded-full right-2 z-20 bg-gray-100 text-gray-700">
                    {categoryName}
                  </div>

                  <div className="relative w-full pt-[100%]">
                    {product.images?.[0] && (
                      <Image
                        src={getImageUrl(product.images[0])}
                        alt={product.name || 'Product'}
                        fill
                        placeholder="blur"
                        blurDataURL={getImageUrl(product.images[0])}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="absolute inset-0 object-cover rounded-t-lg z-10 group-hover:opacity-0 transition-opacity duration-500"
                      />
                    )}
                    {product.images?.[1] && (
                      <Image
                        src={getImageUrl(product.images[1])}
                        alt={`${product.name} alternate view`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="absolute inset-0 object-cover rounded-t-lg"
                        placeholder="blur"
                        blurDataURL={getImageUrl(product.images[1])}
                      />
                    )}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-medium text-gray-800 line-clamp-2 mb-1">{product.name}</h3>

                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-1">(20)</span>
                  </div>

                  <div className="mt-auto pt-3">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-gray-900">{getProductPrice(product)} Rs</div>
                      <Button className="text-xs gap-1">
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductList
