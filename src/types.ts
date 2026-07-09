export type View = 'products' | 'cart' | 'checkout' | 'account' | 'admin'

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating'

export type AuthMode = 'login' | 'register'

export type UserRole = 'CUSTOMER' | 'ADMIN'

export interface Product {
  id: number
  name: string
  category: string
  price: number
  rating: number
  stock: number
  image: string
  description: string
}

export interface CartItem {
  productId: number
  quantity: number
}

export interface CartProduct extends Product {
  quantity: number
}

export interface User {
  name: string
  email: string
  role: UserRole
}

export interface Order {
  id: string
  items: CartProduct[]
  total: number
}

export interface AdminProductDraft {
  name: string
  category: string
  price: string
  stock: string
  description: string
}
