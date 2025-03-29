'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, Search, Sun, Moon, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CartIcon } from '@/components/Navabr/CartIcon'
import { Button } from '../ui/button'
import { authService } from '@/services/auth'
import { useRouter } from 'next/navigation'

interface NavIconsProps {
  isTransparent: boolean
  onSearchOpen: () => void
  isLoggedIn: boolean
  setIsLoggedIn: (login: boolean) => void
}

export function NavIcons({
  isTransparent,
  onSearchOpen,
  isLoggedIn,
  setIsLoggedIn,
}: NavIconsProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    authService.logout()
    setIsLoggedIn(false)
    setProfileOpen(false)
    router.push('/login')
  }

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setProfileOpen(!profileOpen)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Search */}
      <button
        onClick={onSearchOpen}
        className={`${
          isTransparent
            ? 'lg:text-white lg:hover:text-gray-700'
            : 'text-gray-700  hover:text-gray-900 '
        } p-2 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-gray-700`}
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Profile Dropdown */}
      <div className="relative hidden lg:block">
        <button
          onClick={handleProfileClick}
          className={`${
            isTransparent
              ? 'lg:text-white lg:hover:text-gray-700'
              : 'text-gray-700 hover:text-gray-900'
          } p-2 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-gray-700`}
        >
          <User className="h-5 w-5" />
        </button>

        {isLoggedIn && profileOpen && (
          <AnimatePresence>
            <motion.div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Link
                href="/orders"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setProfileOpen(false)}
              >
                Orders
              </Link>
              <div
                className="w-full text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                <Button className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Logout
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Cart */}
      <CartIcon isTransparent={isTransparent} />
    </div>
  )
}
