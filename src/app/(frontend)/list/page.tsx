import Filter from '@/components/Filter'
import ProductList from '@/components/ProductList'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Suspense } from 'react'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navabr'

const ListPage = async ({ searchParams }: { searchParams?: { cat?: string } }) => {
  const payload = await getPayload({ config: config })
  const waitedParams = await searchParams

  // Get category if cat param is provided
  const category = waitedParams?.cat
    ? await payload.find({
        collection: 'categories',
        where: {
          slug: {
            equals: waitedParams?.cat,
          },
        },
        limit: 1,
      })
    : null

  // Get all categories for the filter
  const allCategories = await payload.find({
    collection: 'categories',
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-18">
        {/* Hero Section */}
        <div className="relative h-[400px] w-full">
          <Image
            src="/design.jpg"
            alt="Living room"
            fill
            blurDataURL="/design.jpg"
            sizes="100vw"
            className="object-cover"
            priority
            placeholder="blur"
          />
          <div className="absolute inset-0 flex flex-col flex-wrap justify-center items-center">
            <h1 className="text-[150px] font-bold text-white leading-none">Shop</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 relative -mt-20 bg-white rounded-md">
          {/* Category Title */}
          <div className="flex items-center justify-between flex-wrap p-4 text-center">
            <h2 className="text-xl font-semibold text-center">
              {category?.docs[0]?.name || 'All'} Products For You!
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Category Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <Filter categories={allCategories.docs} />
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <Suspense fallback={<div>Loading products...</div>}>
                <ProductList searchParams={waitedParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ListPage
