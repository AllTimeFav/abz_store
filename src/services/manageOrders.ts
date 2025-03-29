import { useCartStore } from '@/store/cart'

const API_URL = '/api/orders'

export const manageOrders = {
  createOrder: async (orderData: any) => {
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
