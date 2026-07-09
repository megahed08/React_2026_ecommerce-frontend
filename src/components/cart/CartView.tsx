import type { CartProduct } from '../../types'
import { currency } from '../../utils/currency'
import { Button, Chip, EmptyState, Eyebrow, Image } from '../ui'
import { OrderSummary } from './OrderSummary'

interface CartViewProps {
  cartItems: CartProduct[]
  shipping: number
  subtotal: number
  total: number
  onCheckout: () => void
  onQuantityChange: (productId: number, quantity: number) => void
}

export function CartView({
  cartItems,
  onCheckout,
  onQuantityChange,
  shipping,
  subtotal,
  total,
}: CartViewProps) {
  return (
    <section className="split-view" aria-labelledby="cart-title">
      <div>
        <Eyebrow>Shopping cart</Eyebrow>
        <h1 id="cart-title">Review items</h1>

        {cartItems.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Add products from the catalog before checking out."
          />
        ) : (
          <div className="cart-list">
            {cartItems.map((item) => (
              <article className="cart-row" key={item.id}>
                <Image src={item.image} alt={item.name} />
                <div>
                  <Chip>{item.category}</Chip>
                  <h2>{item.name}</h2>
                  <span>{currency.format(item.price)}</span>
                </div>
                <div className="quantity-control" aria-label={`${item.name} quantity`}>
                  <Button
                    variant="quantity"
                    size="square"
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="quantity"
                    size="square"
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <OrderSummary
        buttonLabel="Go to checkout"
        disabled={cartItems.length === 0}
        onAction={onCheckout}
        shipping={shipping}
        subtotal={subtotal}
        total={total}
      />
    </section>
  )
}
