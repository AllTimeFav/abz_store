'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Subscribing email:', email)
  }

  return (
    <footer className="bg-gray-100 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <h3 className="text-2xl tracking-wider  mb-6">ABZ-STORE</h3>
            <address className="not-italic mb-4 text-gray-600">
              3252 Winding Way, Central Plaza,
              <br />
              Lahore, Pakistan
            </address>
            <p className="mb-2 text-gray-600">hello@ecom.dev</p>
            <p className="mb-6 text-gray-600">+1 234 567 890</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Youtube className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-bold mb-6">COMPANY</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-gray-900">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/affiliates" className="text-gray-600 hover:text-gray-900">
                  Affiliates
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Special Categories Column */}
          <div>
            <h3 className="text-lg font-bold mb-6">SPECIAL CATEGORIES</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/list?ribbon=new" className="text-gray-600 hover:text-gray-900">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/list?ribbon=featured" className="text-gray-600 hover:text-gray-900">
                  Featured Products
                </Link>
              </li>
              <li>
                <Link href="/list?ribbon=bestseller" className="text-gray-600 hover:text-gray-900">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/list?ribbon=sale" className="text-gray-600 hover:text-gray-900">
                  Sale
                </Link>
              </li>
              <li>
                <Link href="/list?ribbon=limited" className="text-gray-600 hover:text-gray-900">
                  Limited Edition
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Subscribe Column */}
          <div>
            <h3 className="text-lg font-bold mb-6">HELP</h3>
            <ul className="space-y-3 mb-8">
              <li>
                <Link href="/customer-service" className="text-gray-600 hover:text-gray-900">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-gray-600 hover:text-gray-900">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/find-store" className="text-gray-600 hover:text-gray-900">
                  Find a Store
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-gray-600 hover:text-gray-900">
                  Legal & Privacy
                </Link>
              </li>
              <li>
                <Link href="/gift-card" className="text-gray-600 hover:text-gray-900">
                  Gift Card
                </Link>
              </li>
            </ul>

            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">SUBSCRIBE</h3>
              <p className="text-gray-600 mb-4">
                Be the first to get the latest news about trends, promotions, and much more!
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white"
                />
                <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
                  JOIN
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© 2025 ABZ Shop</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <span>Language</span>
              <select className="bg-transparent">
                <option>United States | English</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span>Currency</span>
              <select className="bg-transparent">
                <option>Rs PKR</option>
                <option>$ USD</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
