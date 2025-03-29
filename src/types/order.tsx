export interface Order {
  id: string
  customer: {
    name: string
    email: string
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
  items: {
    product: string
    quantity: number
    price: number
    color?: string
    size?: string
  }[]
  totalPrice: number
  status: string
  createdAt: string
}
