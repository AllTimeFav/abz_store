'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cart'
import { Cart } from '@/components/Cart'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth'
import { manageOrders } from '@/services/manageOrders'

type FormInputs = {
  name: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

export default function CheckoutPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { items, totalPrice, clearCart } = useCartStore()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Loading state
  const [orderSuccess, setOrderSuccess] = useState(false) // Success message state
  const [cartError, setCartError] = useState<string | null>(null) // Cart error state
  const router = useRouter() // Initialize useRouter

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>()

  // Auto-fill name and email if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { authenticated, user } = await authService.checkAuth()
      console.log('authn : ', authenticated)
      setIsLoggedIn(authenticated)
      if (authenticated) {
        setUser(user.user)
        setValue('name', user.user.username)
        setValue('email', user.user.email)
        console.log('user : ', user)
      }
    }
    checkUser()
  }, [])

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      // Check if the cart is empty
      if (items.length === 0) {
        setCartError('Your cart is empty. Please add items to your cart before placing an order.')
        return
      }

      setIsLoading(true) // Start loading
      setOrderSuccess(false) // Reset success message
      setCartError(null) // Reset cart error

      const orderData = {
        customer: {
          name: data.name,
          email: data.email,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          country: data.country,
        },
        items: items.map((item) => ({
          product: item.id,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
        })),
        totalPrice: totalPrice,
        status: 'pending',
      }

      const result = await manageOrders.createOrder(orderData)

      console.log('result ', result)
      // Show success message
      setOrderSuccess(true)
      clearCart()

      // Navigate to /orders after 3 seconds
      setTimeout(() => {
        router.push('/orders')
      }, 3000)
    } catch (error) {
      console.error('Error creating order:', error)
      // Show an error message to the user
      alert('Failed to create order. Please try again.')
    } finally {
      setIsLoading(false) // Stop loading
    }
  }

  return (
    <div className="container mt-24 mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Checkout Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full px-2 py-2 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              disabled={isLoggedIn}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="mt-1 block px-2 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              disabled={isLoggedIn}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              {...register('address', { required: 'Address is required' })}
              className="mt-1 block w-full px-2 py-2 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                {...register('city', { required: 'City is required' })}
                className="mt-1 block w-full px-2 py-2 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                State <span className="text-red-500">*</span>
              </label>
              <input
                {...register('state', { required: 'State is required' })}
                className="mt-1 block w-full px-2 py-2 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                {...register('zip', { required: 'ZIP Code is required' })}
                className="mt-1 block w-full px-2 py-2 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
              {errors.zip && <p className="text-red-500 text-sm">{errors.zip.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                {...register('country', { required: 'Country is required' })}
                className="mt-1 block w-full px-2 py-2 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
              />
              {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
            </div>
          </div>

          {/* Cart Error Message */}
          {cartError && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {cartError}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg cursor-pointer bg-black py-3 text-white hover:bg-gray-800 transition-colors flex items-center justify-center"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              'Place Order'
            )}
          </button>

          {/* Success Message */}
          {orderSuccess && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              Order created successfully! Redirecting to orders page...
            </div>
          )}
        </form>

        {/* Right Side: Cart Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Order Summary</h2>
          <Cart isCheckoutPage={true} />
          <div className="mt-6">
            <div className="flex justify-between font-medium bg-gray-100 p-2 shadow-md">
              <p>Total</p>
              <p>{totalPrice}Rs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
