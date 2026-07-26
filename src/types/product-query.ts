import type { Product } from "./product";

export type ProductSortField = "featured" | "price" | "rating" | "name";

export type SortDirection = "asc" | "desc";

export interface ProductQuery {
  search: string;
  category: string;
  sortBy: ProductSortField;
  sortDirection: SortDirection;
  page: number;
  pageSize: number;
}

export interface ProductPage {
  items: Product[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
