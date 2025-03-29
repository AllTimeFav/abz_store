import { getPayload } from 'payload'
import config from '@/payload.config'
import { AddToCartButton } from '@/components/AddToCartButton'
import ProductImages from '@/components/ProductImages'
import CustomizeProduct from '@/components/CustomizeProducts'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navabr'
import ProductReviews from '@/components/Reviews/productReviews'

interface PageProps {
  params: {
    slug: string
  }
}

interface Product {
  id: string
  name: string
  description?: {
    root: {
      children: Array<{
        children: Array<{
          text: string
        }>
      }>
    }
  }
  options?: {
    colors?: Array<unknown>
    sizes?: Array<unknown>
    combinations?: Array<unknown>
  }
  images?: Array<unknown>
}

export default async function Page({ params }: PageProps) {
  const payload = await getPayload({ config: await config })
  const waitedParams = await params

  // Fetch the product based on the slug
  const payloadProduct = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: waitedParams.slug },
    },
  })

  const product = payloadProduct.docs[0] as Product | undefined

  if (!product) {
    return <div>No Product Found!</div>
  }

  // Check if the product has variants (colors or sizes)
  const hasVariants =
    (product.options?.colors && product.options.colors.length > 0) ||
    (product.options?.sizes && product.options.sizes.length > 0) ||
    (product.options?.combinations && product.options.combinations.length > 0)

  const renderDescription = (children: any[]) => {
    return children.map((child, index) => {
      switch (child.type) {
        case 'heading':
          return (
            <h1 key={index} className="text-2xl font-semibold my-2">
              {child.children[0]?.text}
            </h1>
          )
        case 'paragraph':
          return (
            <p key={index} className="my-2">
              {child.children[0]?.text}
            </p>
          )
        case 'horizontalrule':
          return <hr key={index} className="my-4 border-gray-300" />
        default:
          return null
      }
    })
  }

  return (
    <>
      <Navbar />
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative mt-20 flex flex-col lg:flex-row gap-16">
        {/* Product Images */}
        <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
          <ProductImages items={product.images || []} />
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl font-medium">{product.name}</h1>
          {product.description?.root && (
            <div className="text-gray-500">
              {renderDescription(product.description.root.children)}
            </div>
          )}

          <div className="h-[2px] bg-gray-100" />

          {/* Conditional Rendering: Customize or Add to Cart */}
          {hasVariants ? (
            <CustomizeProduct
              product={product}
              options={product.options || { colors: [], sizes: [], combinations: [] }}
            />
          ) : (
            <AddToCartButton product={product} />
          )}

          <div className="h-[2px] bg-gray-100" />

          {/* User Reviews Section */}
          <ProductReviews productId={product.id} />
        </div>
      </div>
      <Footer />
    </>
  )
}
