import { useCartStore } from '@/store/cart'

const API_URL = '/api/orders'
interface Customer {
  name: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

interface OrderItem {
  product: string // Assuming you're using product ID here
  image?: string // Added image to match your usage
  quantity: number
  price: number
  color?: string | null
  size?: string | null
  id?: string | null
}

interface OrderData {
  customer: Customer
  items: OrderItem[]
  totalPrice: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

export const manageOrders = {
  createOrder: async (orderData: OrderData) => {
    try {
      const userId = useCartStore.getState().userId
      const response = await fetch(`${API_URL}?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Order created successfully:', result)

      return result
    } catch (error) {
      console.error('Error in createOrder:', error)
      throw error // Re-throw the error to handle it in the frontend
    }
  },
}
