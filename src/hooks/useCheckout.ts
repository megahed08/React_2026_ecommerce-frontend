import { useState, type FormEvent } from 'react'
import type { CartProduct, Order } from '../types'

interface UseCheckoutOptions {
  cartItems: CartProduct[]
  clearCart: () => void
  total: number
}

export function useCheckout({ cartItems, clearCart, total }: UseCheckoutOptions) {
  const [order, setOrder] = useState<Order | null>(null)

  function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (cartItems.length === 0) return

    setOrder({
      id: `ORD-${Date.now().toString().slice(-6)}`,
      items: cartItems,
      total,
    })
    clearCart()
  }

  return {
    order,
    handleCheckout,
  }
}
