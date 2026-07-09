import type { FormEvent } from 'react'
import type { AdminProductDraft, Product, User } from '../../types'
import { currency } from '../../utils/currency'
import { Button, Eyebrow, Field } from '../ui'

interface AdminViewProps {
  draft: AdminProductDraft
  products: Product[]
  user: User | null
  onDraftChange: (draft: AdminProductDraft) => void
  onProductRemove: (productId: number) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function AdminView({
  draft,
  onDraftChange,
  onProductRemove,
  onSubmit,
  products,
  user,
}: AdminViewProps) {
  const canManageProducts = user?.role === 'ADMIN'

  return (
    <section className="admin-view" aria-labelledby="admin-title">
      <div className="section-heading">
        <div>
          <Eyebrow>Admin</Eyebrow>
          <h1 id="admin-title">Product management</h1>
        </div>
        <p>
          {canManageProducts
            ? 'Create catalog entries and remove products from the local mock store.'
            : 'Preview mode. Log in with an email containing admin to enable management actions.'}
        </p>
      </div>

      <form className="admin-form" onSubmit={onSubmit}>
        <Field label="Product name">
          <input
            disabled={!canManageProducts}
            required
            value={draft.name}
            onChange={(event) => onDraftChange({ ...draft, name: event.target.value })}
            placeholder="Product name"
          />
        </Field>

        <Field label="Category">
          <select
            disabled={!canManageProducts}
            value={draft.category}
            onChange={(event) => onDraftChange({ ...draft, category: event.target.value })}
          >
            <option>Accessories</option>
            <option>Bags</option>
            <option>Electronics</option>
            <option>Home</option>
            <option>Shoes</option>
          </select>
        </Field>

        <Field label="Price">
          <input
            disabled={!canManageProducts}
            min="1"
            required
            type="number"
            value={draft.price}
            onChange={(event) => onDraftChange({ ...draft, price: event.target.value })}
            placeholder="49.90"
          />
        </Field>

        <Field label="Stock">
          <input
            disabled={!canManageProducts}
            min="1"
            required
            type="number"
            value={draft.stock}
            onChange={(event) => onDraftChange({ ...draft, stock: event.target.value })}
            placeholder="10"
          />
        </Field>

        <Field className="full-width" label="Description">
          <textarea
            disabled={!canManageProducts}
            required
            value={draft.description}
            onChange={(event) => onDraftChange({ ...draft, description: event.target.value })}
            placeholder="Short product description"
          />
        </Field>

        <Button disabled={!canManageProducts} type="submit" variant="primary">
          Add product
        </Button>
      </form>

      <div className="admin-table" role="table" aria-label="Products">
        <div className="admin-table-header" role="row">
          <span role="columnheader">Product</span>
          <span role="columnheader">Category</span>
          <span role="columnheader">Price</span>
          <span role="columnheader">Stock</span>
          <span role="columnheader">Action</span>
        </div>

        {products.map((product) => (
          <div className="admin-table-row" role="row" key={product.id}>
            <span role="cell">{product.name}</span>
            <span role="cell">{product.category}</span>
            <span role="cell">{currency.format(product.price)}</span>
            <span role="cell">{product.stock}</span>
            <span role="cell">
              <Button
                disabled={!canManageProducts}
                size="sm"
                variant="secondary"
                onClick={() => onProductRemove(product.id)}
              >
                Remove
              </Button>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
