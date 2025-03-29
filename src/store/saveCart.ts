import { useCartStore } from './cart'

export default async function SaveCart() {
  const userId = useCartStore.getState().userId
  const cartItems = useCartStore.getState().items
  if (userId) {
    try {
      // Save the cart to the server
      await fetch(`/api/cart/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems }),
      })

      // Clear the local cart state
      useCartStore.getState().setUserId(null)
    } catch (error) {
      console.error('Failed to save cart or logout:', error)
    }
  }
}
