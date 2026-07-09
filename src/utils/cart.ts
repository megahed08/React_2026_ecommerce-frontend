import type { CartItem, CartProduct, Product } from '../types'

export function getCartProducts(cart: CartItem[], products: Product[]): CartProduct[] {
  return cart.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId)
    return product ? [{ ...product, quantity: item.quantity }] : []
  })
}

export function getCartSubtotal(cartItems: CartProduct[]) {
  return cartItems.reduce((currentSubtotal, item) => {
    return currentSubtotal + item.price * item.quantity
  }, 0)
}

export function getCartCount(cartItems: CartProduct[]) {
  return cartItems.reduce((totalCount, item) => totalCount + item.quantity, 0)
}
