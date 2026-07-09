import type { Product } from '../../types'
import { currency } from '../../utils/currency'
import { Button, Chip, Image } from '../ui'

interface ProductDetailsPanelProps {
  product: Product
  onAddToCart: (productId: number) => void
}

export function ProductDetailsPanel({ product, onAddToCart }: ProductDetailsPanelProps) {
  return (
    <aside className="details-panel" aria-label="Selected product details">
      <Image src={product.image} alt={product.name} />
      <Chip>{product.category}</Chip>
      <h2>{product.name}</h2>
      <p>{product.description}</p>

      <dl className="product-facts">
        <div>
          <dt>Price</dt>
          <dd>{currency.format(product.price)}</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>{product.rating}/5</dd>
        </div>
        <div>
          <dt>Stock</dt>
          <dd>{product.stock} units</dd>
        </div>
      </dl>

      <Button variant="primary" onClick={() => onAddToCart(product.id)}>
        Add selected product
      </Button>
    </aside>
  )
}
