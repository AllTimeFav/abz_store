'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Navbar from '@/components/Navabr'

// Type definitions
type Product = {
  id: string
  name: string
  images: Array<{
    id: string
    image: {
      url: string
      alt?: string
    }
  }>
  options?: {
    colors?: Array<{ color: string }>
    sizes?: Array<{ value: string }>
    combinations?: Array<{
      combination: {
        color: string
        size: string
      }
    }>
  }
}

type OrderItem = {
  id: string
  product: Product
  quantity: number
  price: number
  color?: string | null
  size?: string | null
}

type Customer = {
  name: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

type Order = {
  id: string
  customer: Customer
  items: OrderItem[]
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  totalPrice: number
  createdAt: string
  orderId: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ username?: string; email?: string } | null>(null)
  const router = useRouter()

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Fetch orders for the logged-in user
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if the user is logged in
        const { authenticated, user } = await authService.checkAuth()
        if (!authenticated) {
          router.push('/login')
          return
        }
        setUser(user?.user.username)
        // Fetch orders
        const response = await fetch(`/api/orders?id=${user?.user.id}`, {
          method: 'GET',
        })
        if (response.ok) {
          const data = await response.json()
          console.log('data ', data)
          setOrders(data.docs)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (isLoading) {
    return (
      <div className="mt-24 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="mt-24 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          {user && (
            <p className="text-gray-600 mt-2">
              Welcome back, <span className="font-medium">{user.username}</span>
            </p>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-2 text-gray-600">
              You have not placed any orders yet. Start shopping to see orders here.
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderId}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="sr-only">Items</h3>
                  <ul className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <li key={item.id} className="py-4 flex">
                        {item.product.images?.[0]?.image?.url && (
                          <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden">
                            <Image
                              src={item.product.images[0].image.url}
                              alt={item.product.images[0].image.alt || item.product.name}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                        )}

                        <div className="ml-4 flex-1 flex flex-col sm:flex-row justify-between">
                          <div>
                            <h4 className="text-base font-medium text-gray-900">
                              {item.product.name}
                            </h4>
                            {(item.color || item.size) && (
                              <p className="mt-1 text-sm text-gray-500">
                                {item.color && <span>Color: {item.color}</span>}
                                {item.color && item.size && <span> • </span>}
                                {item.size && <span>Size: {item.size}</span>}
                              </p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:ml-4">
                            <p className="text-base font-medium text-gray-900">
                              {item.quantity} * {item.price.toLocaleString()} Rs
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p>{order.totalPrice.toLocaleString()} Rs</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
