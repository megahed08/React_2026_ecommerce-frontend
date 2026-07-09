import type { Product } from '../../types'
import { currency } from '../../utils/currency'
import { Button, Chip, Image } from '../ui'

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: number) => void
  onProductSelect: (productId: number) => void
}

export function ProductCard({ product, onAddToCart, onProductSelect }: ProductCardProps) {
  return (
    <article className="product-card">
      <Button
        variant="media"
        onClick={() => onProductSelect(product.id)}
        aria-label={`View ${product.name}`}
      >
        <Image src={product.image} alt={product.name} />
      </Button>

      <div className="product-card-body">
        <div>
          <Chip>{product.category}</Chip>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
        </div>

        <div className="product-card-footer">
          <span>{currency.format(product.price)}</span>
          <Button variant="primary" onClick={() => onAddToCart(product.id)}>
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  )
}
