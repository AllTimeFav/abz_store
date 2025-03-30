import { getPayload } from 'payload'
import config from '@/payload.config'
import { AddToCartButton } from '@/components/AddToCartButton'
import ProductImages from '@/components/ProductImages'
import CustomizeProduct from '@/components/CustomizeProducts'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navabr'
import ProductReviews from '@/components/Reviews/productReviews'
import { Product } from '@/payload-types'

interface TextNode {
  text?: string
  type?: string
  [k: string]: unknown
}

interface DescriptionNode {
  type: string
  children?: Array<TextNode | DescriptionNode>
  [k: string]: unknown
}

export type PageProps = {
  params: { slug: string }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config })

  const payloadProduct = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: params.slug },
    },
  })

  const product = payloadProduct.docs[0] as Product | undefined

  if (!product) {
    return <div>No Product Found!</div>
  }

  const hasVariants =
    (product.options?.colors && product.options.colors.length > 0) ||
    (product.options?.sizes && product.options.sizes.length > 0) ||
    (product.options?.combinations && product.options.combinations.length > 0)

  const renderDescription = (nodes: Array<DescriptionNode | TextNode>) => {
    return nodes.map((node, index) => {
      const isTextNode = (n: TextNode): n is TextNode => 'text' in n && typeof n.text === 'string'

      const extractText = (n: DescriptionNode | TextNode): string => {
        if (isTextNode(n)) {
          return n.text || ''
        }

        if (n.children && Array.isArray(n.children)) {
          for (const child of n.children) {
            const text = extractText(child)
            if (text) return text
          }
        }
        return ''
      }

      if (typeof node !== 'object' || node === null || !('type' in node)) {
        return null
      }

      const textContent = extractText(node)

      switch (node.type) {
        case 'heading':
          return (
            <h1 key={index} className="text-2xl font-semibold my-2">
              {textContent}
            </h1>
          )
        case 'paragraph':
          return (
            <p key={index} className="my-2">
              {textContent}
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
        <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
          <ProductImages items={product.images || []} />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl font-medium">{product.name}</h1>
          {product.description?.root?.children && (
            <div className="text-gray-500">
              {renderDescription(product.description.root.children as DescriptionNode[])}
            </div>
          )}

          <div className="h-[2px] bg-gray-100" />

          {hasVariants ? (
            <CustomizeProduct product={product} />
          ) : (
            <AddToCartButton product={product} />
          )}

          <div className="h-[2px] bg-gray-100" />

          <ProductReviews productId={product.id} />
        </div>
      </div>
      <Footer />
    </>
  )
}
