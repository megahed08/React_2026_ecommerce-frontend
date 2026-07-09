import { AccountView } from '../account/AccountView'
import { AdminView } from '../admin/AdminView'
import { CartView } from '../cart/CartView'
import { ProductsView } from '../catalog/ProductsView'
import { CheckoutView } from '../checkout/CheckoutView'
import { Header } from './Header'
import type { StorefrontController } from '../../hooks/useStorefront'

interface StorefrontLayoutProps {
  storefront: StorefrontController
}

export function StorefrontLayout({ storefront }: StorefrontLayoutProps) {
  return (
    <div className="app-shell">
      <Header
        cartCount={storefront.cartCount}
        view={storefront.view}
        onViewChange={storefront.setView}
      />

      <main>
        <CurrentView storefront={storefront} />
      </main>
    </div>
  )
}

function CurrentView({ storefront }: StorefrontLayoutProps) {
  switch (storefront.view) {
    case 'products':
      return (
        <ProductsView
          categories={storefront.categories}
          category={storefront.category}
          filteredProducts={storefront.filteredProducts}
          onAddToCart={storefront.addToCart}
          onCategoryChange={storefront.setCategory}
          onProductSelect={storefront.setSelectedProductId}
          onQueryChange={storefront.setQuery}
          onSortChange={storefront.setSort}
          query={storefront.query}
          selectedProduct={storefront.selectedProduct}
          sort={storefront.sort}
        />
      )

    case 'cart':
      return (
        <CartView
          cartItems={storefront.cartItems}
          onCheckout={storefront.openCheckout}
          onQuantityChange={storefront.updateQuantity}
          shipping={storefront.shipping}
          subtotal={storefront.subtotal}
          total={storefront.total}
        />
      )

    case 'checkout':
      return (
        <CheckoutView
          cartItems={storefront.cartItems}
          onBackToProducts={storefront.openProducts}
          onCheckout={storefront.handleCheckout}
          order={storefront.order}
          shipping={storefront.shipping}
          subtotal={storefront.subtotal}
          total={storefront.total}
          user={storefront.user}
        />
      )

    case 'account':
      return (
        <AccountView
          authMode={storefront.authMode}
          onAuthModeChange={storefront.setAuthMode}
          onAuthSubmit={storefront.handleAuthSubmit}
          onLogout={storefront.logout}
          order={storefront.order}
          user={storefront.user}
        />
      )

    case 'admin':
      return (
        <AdminView
          draft={storefront.adminDraft}
          onDraftChange={storefront.setAdminDraft}
          onProductRemove={storefront.removeProduct}
          onSubmit={storefront.handleAdminSubmit}
          products={storefront.products}
          user={storefront.user}
        />
      )
  }
}
