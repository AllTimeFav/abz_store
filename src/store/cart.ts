import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  color?: string | null
  size?: string | null
  maxQuantity?: number | null
}

type CartStore = {
  userId: string | null
  items: CartItem[]
  totalItems: number
  totalPrice: number
  setUserId: (userId: string | null) => void
  loadCart: (userId: string) => Promise<void>
  saveCart: () => Promise<void>
  addItem: (item: CartItem) => void
  removeItem: (itemId: string, color?: string | null, size?: string | null) => void
  updateQuantity: (
    itemId: string,
    quantity: number,
    color?: string | null,
    size?: string | null,
  ) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      userId: null,
      items: [],
      totalItems: 0,
      totalPrice: 0,

      setUserId: (userId) => {
        set({ userId })
        if (userId) {
          // Load the cart when the user ID is set
          get().loadCart(userId)
        } else {
          // Clear the cart if the user logs out
          set({ items: [], totalItems: 0, totalPrice: 0 })
        }
      },

      saveCart: async () => {
        if (get().userId) {
          try {
            // Save the cart to the server
            await fetch(`/api/cart/${get().userId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: get().items }),
            })

            // Clear the local cart state
            useCartStore.getState().setUserId(null)
          } catch (error) {
            console.error('Failed to save cart or logout:', error)
          }
        }
      },

      loadCart: async (userId) => {
        try {
          // Fetch the cart from the server
          const response = await fetch(`/api/cart/${userId}`)
          const data = await response.json()
          console.log('cart data : ', data)

          // Update the local cart state
          set({
            items: data.items || [],
            totalItems:
              data.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0,
            totalPrice:
              data.items?.reduce(
                (sum: number, item: CartItem) => sum + item.price * item.quantity,
                0,
              ) || 0,
          })
        } catch (error) {
          console.error('Failed to load cart:', error)
        }
      },

      addItem: (item) => {
        const items = get().items
        const existingItem = items.find(
          (i) => i.id === item.id && i.color === item.color && i.size === item.size,
        )

        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + item.quantity,
            item.maxQuantity || Infinity,
          )

          set({
            items: items.map((i) => (i === existingItem ? { ...i, quantity: newQuantity } : i)),
          })
        } else {
          set({ items: [...items, item] })
        }

        // Update totals
        set((state) => ({
          totalItems: state.items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }))
      },

      removeItem: (itemId, color, size) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => !(item.id === itemId && item.color === color && item.size === size),
          )

          return {
            items: newItems,
            totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          }
        })
      },

      updateQuantity: (itemId, quantity, color, size) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === itemId && item.color === color && item.size === size
              ? { ...item, quantity }
              : item,
          )

          return {
            items: newItems,
            totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          }
        })
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 })
      },
    }),
    {
      name: 'cart-storage',
      // serialize: (state) => JSON.stringify(state),
      // deserialize: (str) => JSON.parse(str),
    },
  ),
)
