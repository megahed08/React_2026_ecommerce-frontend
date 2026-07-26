import { initialProducts } from "../../mocks/products";
import type { Product } from "../../types/product";

const PRODUCTS_STORAGE_KEY = "shop.products";

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const product = value as Partial<Product>;

  return (
    typeof product.id === "number" &&
    Number.isInteger(product.id) &&
    product.id > 0 &&
    typeof product.name === "string" &&
    typeof product.category === "string" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    product.price >= 0 &&
    typeof product.rating === "number" &&
    Number.isFinite(product.rating) &&
    product.rating >= 0 &&
    product.rating <= 5 &&
    typeof product.stock === "number" &&
    Number.isInteger(product.stock) &&
    product.stock >= 0 &&
    typeof product.image === "string" &&
    typeof product.description === "string"
  );
}

function cloneProduct(product: Product): Product {
  return {
    ...product,
  };
}

function getInitialProducts(): Product[] {
  return initialProducts.map(cloneProduct);
}

export function loadMockProducts(): Product[] {
  try {
    const storedValue = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);

    if (!storedValue) {
      return getInitialProducts();
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return getInitialProducts();
    }

    const products = parsedValue.filter(isProduct);

    /*
     * An empty array is valid. It could later
     * represent a catalog with no products.
     */
    if (products.length !== parsedValue.length) {
      return getInitialProducts();
    }

    return products.map(cloneProduct);
  } catch {
    return getInitialProducts();
  }
}

export function saveMockProducts(products: Product[]): void {
  window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

export function findMockProductById(productId: number): Product | null {
  const product = loadMockProducts().find(
    (currentProduct) => currentProduct.id === productId,
  );

  return product ? cloneProduct(product) : null;
}

export function getNextMockProductId(products: Product[]): number {
  const highestProductId = products.reduce(
    (highestId, product) => Math.max(highestId, product.id),
    0,
  );

  return highestProductId + 1;
}

export function resetMockProducts(): Product[] {
  const products = getInitialProducts();

  saveMockProducts(products);

  return products;
}
