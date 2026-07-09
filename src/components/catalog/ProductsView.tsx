import type { Product, SortOption } from '../../types'
import { EmptyState, Eyebrow, Field } from '../ui'
import { ProductCard } from './ProductCard'
import { ProductDetailsPanel } from './ProductDetailsPanel'

interface ProductsViewProps {
  categories: string[]
  category: string
  filteredProducts: Product[]
  query: string
  selectedProduct?: Product
  sort: SortOption
  onAddToCart: (productId: number) => void
  onCategoryChange: (category: string) => void
  onProductSelect: (productId: number) => void
  onQueryChange: (query: string) => void
  onSortChange: (sort: SortOption) => void
}

export function ProductsView({
  categories,
  category,
  filteredProducts,
  onAddToCart,
  onCategoryChange,
  onProductSelect,
  onQueryChange,
  onSortChange,
  query,
  selectedProduct,
  sort,
}: ProductsViewProps) {
  return (
    <section className="catalog-view" aria-labelledby="catalog-title">
      <div className="section-heading">
        <div>
          <Eyebrow>Frontend milestone 1</Eyebrow>
          <h1 id="catalog-title">Product catalog</h1>
        </div>
        <p>
          Mock storefront data for catalog browsing, cart behavior, checkout, account, and admin
          product management.
        </p>
      </div>

      <div className="toolbar" aria-label="Product controls">
        <Field label="Search">
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search products"
          />
        </Field>

        <Field label="Category">
          <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
            {categories.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Sort">
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </Field>
      </div>

      <div className="catalog-layout">
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onProductSelect={onProductSelect}
            />
          ))}

          {filteredProducts.length === 0 && (
            <EmptyState
              className="grid-span-full"
              title="No products found"
              description="Adjust the filters or search phrase to see more products."
            />
          )}
        </div>

        {selectedProduct && (
          <ProductDetailsPanel product={selectedProduct} onAddToCart={onAddToCart} />
        )}
      </div>
    </section>
  )
}
