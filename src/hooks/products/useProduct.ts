import { useEffect, useState } from "react";

import { productService } from "../../services/products/product-service";
import type { Product } from "../../types/product";

interface ProductLoadState {
  loadedProductId: number | null;
  product: Product | null;
  error: string | null;
}

interface UseProductResult {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  isNotFound: boolean;
}

const INITIAL_STATE: ProductLoadState = {
  loadedProductId: null,
  product: null,
  error: null,
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "The product could not be loaded.";
}

export function useProduct(productId: number | null): UseProductResult {
  const [state, setState] = useState<ProductLoadState>(INITIAL_STATE);

  useEffect(() => {
    if (productId === null) {
      return;
    }

    const requestedProductId = productId;

    let ignoreResult = false;

    async function loadProduct(): Promise<void> {
      try {
        const loadedProduct =
          await productService.getProductById(requestedProductId);

        if (ignoreResult) {
          return;
        }

        setState({
          loadedProductId: requestedProductId,
          product: loadedProduct,
          error: null,
        });
      } catch (caughtError) {
        if (ignoreResult) {
          return;
        }

        setState({
          loadedProductId: requestedProductId,
          product: null,
          error: getErrorMessage(caughtError),
        });
      }
    }

    void loadProduct();

    return () => {
      ignoreResult = true;
    };
  }, [productId]);

  if (productId === null) {
    return {
      product: null,
      isLoading: false,
      error: null,
      isNotFound: false,
    };
  }

  const hasLoadedRequestedProduct = state.loadedProductId === productId;

  if (!hasLoadedRequestedProduct) {
    return {
      product: null,
      isLoading: true,
      error: null,
      isNotFound: false,
    };
  }

  return {
    product: state.product,
    isLoading: false,
    error: state.error,

    isNotFound: state.error === null && state.product === null,
  };
}
