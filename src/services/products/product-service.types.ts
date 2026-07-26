import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from "../../types/product";

import type { ProductPage, ProductQuery } from "../../types/product-query";

export interface ProductService {
  getProducts(query: ProductQuery): Promise<ProductPage>;

  getProductById(id: number): Promise<Product | null>;

  getCategories(): Promise<string[]>;

  getAllProducts(): Promise<Product[]>;

  createProduct(request: CreateProductRequest): Promise<Product>;

  updateProduct(
    id: number,
    request: UpdateProductRequest,
  ): Promise<Product | null>;

  deleteProduct(id: number): Promise<boolean>;

  resetProducts(): Promise<Product[]>;
}
