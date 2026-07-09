import { useState, type FormEvent } from 'react'
import { emptyAdminDraft } from '../data/products'
import type { AdminProductDraft, View } from '../types'
import { useAccount } from './useAccount'
import { useCart } from './useCart'
import { useCatalog } from './useCatalog'
import { useCheckout } from './useCheckout'

export function useStorefront() {
  const [view, setView] = useState<View>('products')
  const [adminDraft, setAdminDraft] = useState<AdminProductDraft>(emptyAdminDraft)

  function openProducts() {
    setView('products')
  }

  function openCheckout() {
    setView('checkout')
  }

  const catalog = useCatalog()
  const cart = useCart(catalog.products)
  const account = useAccount(openProducts)
  const checkout = useCheckout({
    cartItems: cart.cartItems,
    clearCart: cart.clearCart,
    total: cart.total,
  })

  function handleAdminSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const productWasCreated = catalog.addProductFromDraft(adminDraft)

    if (!productWasCreated) return

    setAdminDraft(emptyAdminDraft)
    openProducts()
  }

  function removeProduct(productId: number) {
    catalog.removeProduct(productId)
    cart.removeProductFromCart(productId)
  }

  return {
    adminDraft,
    authMode: account.authMode,
    cartCount: cart.cartCount,
    cartItems: cart.cartItems,
    categories: catalog.categories,
    category: catalog.category,
    filteredProducts: catalog.filteredProducts,
    order: checkout.order,
    products: catalog.products,
    query: catalog.query,
    selectedProduct: catalog.selectedProduct,
    shipping: cart.shipping,
    sort: catalog.sort,
    subtotal: cart.subtotal,
    total: cart.total,
    user: account.user,
    view,
    addToCart: cart.addToCart,
    handleAdminSubmit,
    handleAuthSubmit: account.handleAuthSubmit,
    handleCheckout: checkout.handleCheckout,
    logout: account.logout,
    openCheckout,
    openProducts,
    removeProduct,
    setAdminDraft,
    setAuthMode: account.setAuthMode,
    setCategory: catalog.setCategory,
    setQuery: catalog.setQuery,
    setSelectedProductId: catalog.setSelectedProductId,
    setSort: catalog.setSort,
    setView,
    updateQuantity: cart.updateQuantity,
  }
}

export type StorefrontController = ReturnType<typeof useStorefront>
