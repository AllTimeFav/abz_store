'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const heroImages = [
  {
    src: '/fashion.jpg',
    alt: 'Fashion Collection',
    heading: 'Discover Your Style',
    subheading: 'Explore our latest collection and find your perfect look',
  },
  {
    src: '/summer.jpg',
    alt: 'Summer Essentials',
    heading: 'Summer Essentials',
    subheading: 'Get ready for the season with our curated summer collection',
  },
  {
    src: '/electronics.jpg',
    alt: 'Accessories Showcase',
    heading: 'Complete Your Look',
    subheading: 'Discover our range of accessories to elevate any outfit',
  },
]

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      <AnimatePresence initial={false} custom={currentIndex}>
        {heroImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <motion.h1
                  className="text-4xl md:text-6xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {image.heading}
                </motion.h1>
                <motion.p
                  className="text-xl mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {image.subheading}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Link
                    href="/list"
                    className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded dark:bg-white dark:text-black"
                  >
                    Shop Now
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-[43%] left-1 transform -translate-y-1/2 bg-transparent border-none outline-none text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-[43%] right-1 transform -translate-y-1/2 bg-transparent border-none outline-none text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </section>
  )
}

export default HeroSection
