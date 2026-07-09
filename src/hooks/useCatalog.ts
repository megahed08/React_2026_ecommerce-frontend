import { useMemo, useState } from 'react'
import { adminProductImage, initialProducts } from '../data/products'
import type { AdminProductDraft, Product, SortOption } from '../types'
import { filterAndSortProducts, getProductCategories } from '../utils/catalog'

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [selectedProductId, setSelectedProductId] = useState<number>(initialProducts[0].id)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState<SortOption>('featured')

  const categories = useMemo(() => getProductCategories(products), [products])

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, { category, query, sort }),
    [category, products, query, sort],
  )

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? filteredProducts[0]

  function addProductFromDraft(draft: AdminProductDraft) {
    const price = Number(draft.price)
    const stock = Number(draft.stock)

    if (Number.isNaN(price) || Number.isNaN(stock)) return false

    const nextProduct: Product = {
      id: Date.now(),
      name: draft.name,
      category: draft.category,
      price,
      rating: 4.2,
      stock,
      image: adminProductImage,
      description: draft.description,
    }

    setProducts((currentProducts) => [nextProduct, ...currentProducts])
    setSelectedProductId(nextProduct.id)

    return true
  }

  function removeProduct(productId: number) {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId))
  }

  return {
    categories,
    category,
    filteredProducts,
    products,
    query,
    selectedProduct,
    sort,
    addProductFromDraft,
    removeProduct,
    setCategory,
    setQuery,
    setSelectedProductId,
    setSort,
  }
}
