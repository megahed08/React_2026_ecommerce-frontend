import type { Product, SortOption } from '../types'

interface ProductFilterOptions {
  category: string
  query: string
  sort: SortOption
}

export function getProductCategories(products: Product[]) {
  return ['All', ...Array.from(new Set(products.map((product) => product.category)))]
}

export function filterAndSortProducts(products: Product[], options: ProductFilterOptions) {
  const normalizedQuery = options.query.trim().toLowerCase()
  const visibleProducts = products.filter((product) => {
    const matchesCategory = options.category === 'All' || product.category === options.category
    const matchesQuery =
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery)

    return matchesCategory && matchesQuery
  })

  return [...visibleProducts].sort((a, b) => {
    if (options.sort === 'price-low') return a.price - b.price
    if (options.sort === 'price-high') return b.price - a.price
    if (options.sort === 'rating') return b.rating - a.rating
    return a.id - b.id
  })
}
