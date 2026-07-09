import type { FormEvent } from 'react'
import type { CartProduct, Order, User } from '../../types'
import { OrderSummary } from '../cart/OrderSummary'
import { Button, Eyebrow, Field } from '../ui'

interface CheckoutViewProps {
  cartItems: CartProduct[]
  order: Order | null
  shipping: number
  subtotal: number
  total: number
  user: User | null
  onBackToProducts: () => void
  onCheckout: (event: FormEvent<HTMLFormElement>) => void
}

export function CheckoutView({
  cartItems,
  onBackToProducts,
  onCheckout,
  order,
  shipping,
  subtotal,
  total,
  user,
}: CheckoutViewProps) {
  if (order) {
    return (
      <section className="checkout-success" aria-labelledby="order-title">
        <Eyebrow>Order created</Eyebrow>
        <h1 id="order-title">Order {order.id}</h1>
        <p>
          The checkout flow is simulated for now. Later this screen can call the Spring Boot order
          API and publish the first Kafka order event.
        </p>
        <Button variant="primary" onClick={onBackToProducts}>
          Continue shopping
        </Button>
      </section>
    )
  }

  return (
    <section className="split-view" aria-labelledby="checkout-title">
      <form className="checkout-form" onSubmit={onCheckout}>
        <Eyebrow>Checkout</Eyebrow>
        <h1 id="checkout-title">Shipping details</h1>

        <Field label="Full name">
          <input required name="name" defaultValue={user?.name ?? ''} placeholder="Your name" />
        </Field>

        <Field label="Email">
          <input
            required
            name="email"
            type="email"
            defaultValue={user?.email ?? ''}
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Address">
          <input required name="address" placeholder="Street, house number" />
        </Field>

        <div className="form-grid">
          <Field label="City">
            <input required name="city" placeholder="Berlin" />
          </Field>
          <Field label="Postal code">
            <input required name="postalCode" placeholder="10115" />
          </Field>
        </div>

        <fieldset>
          <legend>Payment</legend>
          <label className="radio-line">
            <input name="payment" type="radio" defaultChecked />
            Simulated card payment
          </label>
          <label className="radio-line">
            <input name="payment" type="radio" />
            Invoice after delivery
          </label>
        </fieldset>

        <Button disabled={cartItems.length === 0} type="submit" variant="primary">
          Place order
        </Button>
      </form>

      <OrderSummary shipping={shipping} subtotal={subtotal} total={total} disabled />
    </section>
  )
}
