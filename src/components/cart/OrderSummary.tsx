import { currency } from '../../utils/currency'
import { Button } from '../ui'

interface OrderSummaryProps {
  buttonLabel?: string
  disabled?: boolean
  shipping: number
  subtotal: number
  total: number
  onAction?: () => void
}

export function OrderSummary({
  buttonLabel,
  disabled = false,
  onAction,
  shipping,
  subtotal,
  total,
}: OrderSummaryProps) {
  return (
    <aside className="summary-panel" aria-label="Order summary">
      <h2>Order summary</h2>
      <div className="summary-line">
        <span>Subtotal</span>
        <strong>{currency.format(subtotal)}</strong>
      </div>
      <div className="summary-line">
        <span>Shipping</span>
        <strong>{shipping === 0 ? 'Free' : currency.format(shipping)}</strong>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong>{currency.format(total)}</strong>
      </div>
      {onAction && buttonLabel && (
        <Button disabled={disabled} variant="primary" onClick={onAction}>
          {buttonLabel}
        </Button>
      )}
    </aside>
  )
}
