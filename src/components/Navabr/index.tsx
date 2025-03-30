'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { NavIcons } from './NavIcons'
import { SearchBar } from './SearchBar'
import { MenuComponent } from './MenuComponent'
import { authService } from '@/services/auth'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])

  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isTransparent = isHomePage && !isScrolled

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(
          data.docs.map((cat: { name: string; slug: string }) => ({
            name: cat.name,
            slug: cat.slug || '',
          })),
        )
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        // setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkLogin = async () => {
      const { authenticated, user } = await authService.checkAuth()
      setIsLoggedIn(authenticated)
      console.log(user, 'first', authenticated)
    }
    checkLogin()
  }, [])

  // if (loading) {
  //   return (
  //     <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm shadow-md">
  //       <div className="container mx-auto px-4 py-4">
  //         <div className="flex items-center justify-between">
  //           <div className="text-2xl font-bold">ABZ-STORE</div>
  //         </div>
  //       </div>
  //     </header>
  //   )
  // }

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? 'lg:bg-transparent lg:backdrop-blur-none bg-white backdrop-blur-sm '
            : 'bg-white backdrop-blur-sm  shadow-md'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Logo */}
              <Link
                href="/"
                className={`text-2xl font-bold ${isTransparent ? 'lg:text-white' : ''}`}
              >
                ABZ-STORE
              </Link>
            </div>

            {/* Desktop Categories */}
            <nav className="hidden lg:flex space-x-6">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/list?cat=${category.slug}`}
                  className={`${
                    isTransparent
                      ? 'text-white hover:text-gray-200'
                      : 'text-gray-700  hover:text-gray-900'
                  } transition-colors`}
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* Nav Icons */}
            <NavIcons
              isTransparent={isTransparent}
              onSearchOpen={() => setIsSearchOpen(true)}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          isTransparent={isTransparent}
        />
      </motion.header>

      {/* Mobile Menu */}
      <MenuComponent
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        categories={categories}
        isLoggedIn={isLoggedIn}
      />
    </>
  )
}
