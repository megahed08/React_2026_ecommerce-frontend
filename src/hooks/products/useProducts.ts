import { useCallback, useEffect, useState } from "react";

import { productService } from "../../services/products/product-service";
import { useDebounce } from "./useDebounce";

import type {
  ProductPage,
  ProductQuery,
  ProductSortField,
  SortDirection,
} from "../../types/product-query";

const DEFAULT_QUERY: ProductQuery = {
  search: "",
  category: "all",
  sortBy: "featured",
  sortDirection: "asc",
  page: 0,
  pageSize: 5,
};

const INITIAL_PRODUCT_PAGE: ProductPage = {
  items: [],
  totalItems: 0,
  page: DEFAULT_QUERY.page,
  pageSize: DEFAULT_QUERY.pageSize,
  totalPages: 0,
};

interface ProductsLoadState {
  requestKey: string | null;
  productPage: ProductPage;
  error: string | null;
}

export function useProducts() {
  const [query, setQuery] = useState<ProductQuery>(DEFAULT_QUERY);

  const [categories, setCategories] = useState<string[]>([]);

  const [state, setState] = useState<ProductsLoadState>({
    requestKey: null,
    productPage: INITIAL_PRODUCT_PAGE,
    error: null,
  });

  const { search, category, sortBy, sortDirection, page, pageSize } = query;

  const debouncedSearch = useDebounce(search, 400);

  const requestKey = JSON.stringify({
    search: debouncedSearch,
    category,
    sortBy,
    sortDirection,
    page,
    pageSize,
  });

  useEffect(() => {
    let ignoreResult = false;

    const requestQuery: ProductQuery = {
      search: debouncedSearch,
      category,
      sortBy,
      sortDirection,
      page,
      pageSize,
    };

    async function loadProducts(): Promise<void> {
      try {
        const result = await productService.getProducts(requestQuery);

        if (!ignoreResult) {
          setState({
            requestKey,
            productPage: result,
            error: null,
          });
        }
      } catch (caughtError) {
        if (!ignoreResult) {
          setState((currentState) => ({
            requestKey,
            productPage: currentState.productPage,
            error:
              caughtError instanceof Error
                ? caughtError.message
                : "Products could not be loaded.",
          }));
        }
      }
    }

    void loadProducts();

    return () => {
      ignoreResult = true;
    };
  }, [
    requestKey,
    debouncedSearch,
    category,
    sortBy,
    sortDirection,
    page,
    pageSize,
  ]);

  useEffect(() => {
    let ignoreResult = false;

    async function loadCategories(): Promise<void> {
      try {
        const result = await productService.getCategories();

        if (!ignoreResult) {
          setCategories(result);
        }
      } catch {
        if (!ignoreResult) {
          setCategories([]);
        }
      }
    }

    void loadCategories();

    return () => {
      ignoreResult = true;
    };
  }, []);

  const setSearch = useCallback((newSearch: string): void => {
    setQuery((currentQuery) => ({
      ...currentQuery,
      search: newSearch,
      page: 0,
    }));
  }, []);

  const setCategory = useCallback((newCategory: string): void => {
    setQuery((currentQuery) => ({
      ...currentQuery,
      category: newCategory,
      page: 0,
    }));
  }, []);

  const setSortBy = useCallback((newSortBy: ProductSortField): void => {
    setQuery((currentQuery) => ({
      ...currentQuery,
      sortBy: newSortBy,
      page: 0,
    }));
  }, []);

  const setSortDirection = useCallback(
    (newSortDirection: SortDirection): void => {
      setQuery((currentQuery) => ({
        ...currentQuery,
        sortDirection: newSortDirection,
        page: 0,
      }));
    },
    [],
  );

  const setPage = useCallback((newPage: number): void => {
    setQuery((currentQuery) => ({
      ...currentQuery,
      page: newPage,
    }));
  }, []);

  const setPageSize = useCallback((newPageSize: number): void => {
    setQuery((currentQuery) => ({
      ...currentQuery,
      pageSize: newPageSize,
      page: 0,
    }));
  }, []);

  const isLoading = state.requestKey !== requestKey;

  const error = state.requestKey === requestKey ? state.error : null;

  return {
    query,

    products: state.productPage.items,

    categories,

    totalItems: state.productPage.totalItems,

    totalPages: state.productPage.totalPages,

    isLoading,
    error,

    setSearch,
    setCategory,
    setSortBy,
    setSortDirection,
    setPage,
    setPageSize,
  };
}
