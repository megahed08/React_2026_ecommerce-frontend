import { useMemo, useState } from 'react'
import type { CartItem, Product } from '../types'
import { getCartCount, getCartProducts, getCartSubtotal } from '../utils/cart'

export function useCart(products: Product[]) {
  const [cart, setCart] = useState<CartItem[]>([])

  const cartItems = useMemo(() => getCartProducts(cart, products), [cart, products])
  const cartCount = getCartCount(cartItems)
  const subtotal = getCartSubtotal(cartItems)
  const shipping = subtotal > 0 && subtotal < 100 ? 6.9 : 0
  const total = subtotal + shipping

  function addToCart(productId: number, quantity = 1) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.productId === productId)

      if (!existingItem) {
        return [...currentCart, { productId, quantity }]
      }

      return currentCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
          : item,
      )
    })
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      removeProductFromCart(productId)
      return
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(quantity, 99) } : item,
      ),
    )
  }

  function removeProductFromCart(productId: number) {
    setCart((currentCart) => currentCart.filter((item) => item.productId !== productId))
  }

  function clearCart() {
    setCart([])
  }

  return {
    cartCount,
    cartItems,
    shipping,
    subtotal,
    total,
    addToCart,
    clearCart,
    removeProductFromCart,
    updateQuantity,
  }
}
