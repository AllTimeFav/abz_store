'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { authService } from '@/services/auth'

interface MenuComponentProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  categories: { name: string; slug: string }[]
  isLoggedIn: boolean // Add this prop
}

export function MenuComponent({
  mobileMenuOpen,
  setMobileMenuOpen,
  categories,
  isLoggedIn, // Destructure the prop
}: MenuComponentProps) {
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileMenuOpen, setMobileMenuOpen])

  const handleLogout = () => {
    authService.logout()
  }

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          ref={mobileMenuRef}
          className="fixed inset-0 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            className="absolute top-[72px] left-0 right-0 bottom-0 bg-white dark:bg-gray-900 overflow-y-auto"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="p-6 space-y-6">
              {/* Categories Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/list?cat=${category.slug}`}
                      className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Account Section (Conditional Rendering) */}
              {isLoggedIn ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account</h3>
                  <div className="space-y-2">
                    <Link
                      href="/orders"
                      className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <div
                      className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors cursor-pointer"
                      onClick={handleLogout}
                    >
                      <Button className="block cursor-pointer">Logout</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                >
                  Login
                </Link>
              )}

              {/* Close Menu Button */}
              <button
                className="w-full py-2 px-3 rounded-md border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Close Menu
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
