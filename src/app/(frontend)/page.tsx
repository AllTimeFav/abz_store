import ProductList from '@/components/ProductList'
import CategoryList from '@/components/CategoryList'
import HeroSection from '@/components/Hero'
import { Suspense } from 'react'
import Navbar from '@/components/Navabr'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="">
        <HeroSection />
        <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
          <h1 className="text-2xl">Featured Products</h1>
          <Suspense fallback={<div className="text-center">Loading products...</div>}>
            <ProductList limit={4} ribbon="featured" />
          </Suspense>
        </div>
        <div className="mt-24 ">
          <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-32 mb-14">Categories</h1>
          <Suspense fallback={<div className="text-center">Loading categories...</div>}>
            <CategoryList />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  )
}
