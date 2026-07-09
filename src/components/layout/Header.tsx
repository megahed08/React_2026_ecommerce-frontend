import type { ReactNode } from 'react'
import type { View } from '../../types'
import { Button } from '../ui'

interface HeaderProps {
  cartCount: number
  view: View
  onViewChange: (view: View) => void
}

interface NavButtonProps {
  children: ReactNode
  currentView: View
  onClick: (view: View) => void
  targetView: View
}

function NavButton({ children, currentView, onClick, targetView }: NavButtonProps) {
  return (
    <Button
      active={currentView === targetView}
      variant="nav"
      onClick={() => onClick(targetView)}
    >
      {children}
    </Button>
  )
}

export function Header({ cartCount, view, onViewChange }: HeaderProps) {
  return (
    <header className="topbar">
      <Button className="brand-button" variant="brand" onClick={() => onViewChange('products')}>
        <span className="brand-mark">S</span>
        <span>
          <strong>Storefront</strong>
          <small>React commerce frontend</small>
        </span>
      </Button>

      <nav className="nav-links" aria-label="Primary navigation">
        <NavButton currentView={view} targetView="products" onClick={onViewChange}>
          Products
        </NavButton>
        <NavButton currentView={view} targetView="cart" onClick={onViewChange}>
          Cart ({cartCount})
        </NavButton>
        <NavButton currentView={view} targetView="checkout" onClick={onViewChange}>
          Checkout
        </NavButton>
        <NavButton currentView={view} targetView="account" onClick={onViewChange}>
          Account
        </NavButton>
        <NavButton currentView={view} targetView="admin" onClick={onViewChange}>
          Admin
        </NavButton>
      </nav>
    </header>
  )
}
