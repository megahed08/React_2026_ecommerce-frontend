import { useCallback, useEffect, useState } from "react";

import { productService } from "../../services/products/product-service";

import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from "../../types/product";

interface AdminProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

interface UseAdminProductsResult {
  products: Product[];
  isLoading: boolean;
  isSaving: boolean;
  deletingProductId: number | null;
  isResetting: boolean;
  error: string | null;

  reload: () => Promise<void>;

  createProduct: (request: CreateProductRequest) => Promise<Product | null>;

  updateProduct: (
    productId: number,
    request: UpdateProductRequest,
  ) => Promise<Product | null>;

  deleteProduct: (productId: number) => Promise<boolean>;

  resetProducts: () => Promise<boolean>;

  clearError: () => void;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "The product operation could not be completed.";
}

function sortProducts(products: Product[]): Product[] {
  return [...products].sort(
    (firstProduct, secondProduct) => firstProduct.id - secondProduct.id,
  );
}

export function useAdminProducts(): UseAdminProductsResult {
  const [state, setState] = useState<AdminProductsState>({
    products: [],
    isLoading: true,
    error: null,
  });

  const [isSaving, setIsSaving] = useState(false);

  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null,
  );

  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialProducts(): Promise<void> {
      try {
        const loadedProducts = await productService.getAllProducts();

        if (cancelled) {
          return;
        }

        setState({
          products: sortProducts(loadedProducts),
          isLoading: false,
          error: null,
        });
      } catch (caughtError) {
        if (cancelled) {
          return;
        }

        setState({
          products: [],
          isLoading: false,
          error: getErrorMessage(caughtError),
        });
      }
    }

    void loadInitialProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const reload = useCallback(async (): Promise<void> => {
    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    try {
      const loadedProducts = await productService.getAllProducts();

      setState({
        products: sortProducts(loadedProducts),
        isLoading: false,
        error: null,
      });
    } catch (caughtError) {
      setState((currentState) => ({
        ...currentState,
        isLoading: false,
        error: getErrorMessage(caughtError),
      }));
    }
  }, []);

  const createProduct = useCallback(
    async (request: CreateProductRequest): Promise<Product | null> => {
      setIsSaving(true);

      setState((currentState) => ({
        ...currentState,
        error: null,
      }));

      try {
        const createdProduct = await productService.createProduct(request);

        setState((currentState) => ({
          ...currentState,

          products: sortProducts([...currentState.products, createdProduct]),

          error: null,
        }));

        return createdProduct;
      } catch (caughtError) {
        setState((currentState) => ({
          ...currentState,
          error: getErrorMessage(caughtError),
        }));

        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const updateProduct = useCallback(
    async (
      productId: number,
      request: UpdateProductRequest,
    ): Promise<Product | null> => {
      setIsSaving(true);

      setState((currentState) => ({
        ...currentState,
        error: null,
      }));

      try {
        const updatedProduct = await productService.updateProduct(
          productId,
          request,
        );

        if (!updatedProduct) {
          setState((currentState) => ({
            ...currentState,

            error: "The product could not be found.",
          }));

          return null;
        }

        setState((currentState) => ({
          ...currentState,

          products: sortProducts(
            currentState.products.map((product) =>
              product.id === productId ? updatedProduct : product,
            ),
          ),

          error: null,
        }));

        return updatedProduct;
      } catch (caughtError) {
        setState((currentState) => ({
          ...currentState,
          error: getErrorMessage(caughtError),
        }));

        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const deleteProduct = useCallback(
    async (productId: number): Promise<boolean> => {
      setDeletingProductId(productId);

      setState((currentState) => ({
        ...currentState,
        error: null,
      }));

      try {
        const wasDeleted = await productService.deleteProduct(productId);

        if (!wasDeleted) {
          setState((currentState) => ({
            ...currentState,

            error: "The product could not be found.",
          }));

          return false;
        }

        setState((currentState) => ({
          ...currentState,

          products: currentState.products.filter(
            (product) => product.id !== productId,
          ),

          error: null,
        }));

        return true;
      } catch (caughtError) {
        setState((currentState) => ({
          ...currentState,
          error: getErrorMessage(caughtError),
        }));

        return false;
      } finally {
        setDeletingProductId(null);
      }
    },
    [],
  );

  const resetProducts = useCallback(async (): Promise<boolean> => {
    setIsResetting(true);

    setState((currentState) => ({
      ...currentState,
      error: null,
    }));

    try {
      const restoredProducts = await productService.resetProducts();

      setState({
        products: sortProducts(restoredProducts),

        isLoading: false,
        error: null,
      });

      return true;
    } catch (caughtError) {
      setState((currentState) => ({
        ...currentState,
        error: getErrorMessage(caughtError),
      }));

      return false;
    } finally {
      setIsResetting(false);
    }
  }, []);

  const clearError = useCallback((): void => {
    setState((currentState) => ({
      ...currentState,
      error: null,
    }));
  }, []);

  return {
    products: state.products,
    isLoading: state.isLoading,
    isSaving,
    deletingProductId,
    isResetting,
    error: state.error,

    reload,
    createProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    clearError,
  };
}
