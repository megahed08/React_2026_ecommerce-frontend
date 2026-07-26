import { useCallback, useEffect, useMemo, useState } from "react";

import type { PropsWithChildren } from "react";

import { useAuth } from "../../hooks/auth/useAuth";
import { useNotification } from "../../hooks/notifications/useNotification";
import { cartService } from "../../services/cart/cart-service";
import type { Cart } from "../../types/cart";

import { CartContext, type CartContextValue } from "./cart-context";

interface ScopedCartState {
  scope: string | null;
  cart: Cart;
  error: string | null;
}

const EMPTY_CART: Cart = {
  items: [],
  totalQuantity: 0,
  subtotal: 0,
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "The cart operation failed.";
}

export function CartProvider({ children }: PropsWithChildren) {
  const { user, isLoading: isAuthLoading } = useAuth();

  const { showSuccess, showWarning, showError } = useNotification();

  const [scopedCartState, setScopedCartState] = useState<ScopedCartState>({
    scope: null,
    cart: EMPTY_CART,
    error: null,
  });

  const [isReloading, setIsReloading] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const currentCartScope = isAuthLoading ? null : (user?.id ?? "guest");

  useEffect(() => {
    if (currentCartScope === null) {
      return;
    }

    let cancelled = false;

    async function synchronizeCart(): Promise<void> {
      try {
        let loadedCart: Cart;

        if (currentCartScope === "guest") {
          loadedCart = await cartService.getCart();
        } else {
          const mergeResult = await cartService.mergeGuestCart();

          loadedCart = mergeResult.cart;

          if (!cancelled && mergeResult.merged) {
            if (mergeResult.adjustedToStock) {
              showWarning(
                "Guest cart merged. Some quantities were reduced to available stock.",
              );
            } else {
              showSuccess("Guest cart added to your account.");
            }
          }
        }

        if (!cancelled) {
          setScopedCartState({
            scope: currentCartScope,
            cart: loadedCart,
            error: null,
          });
        }
      } catch (caughtError) {
        if (!cancelled) {
          const errorMessage =
            caughtError instanceof Error
              ? caughtError.message
              : "The cart could not be loaded.";

          setScopedCartState({
            scope: currentCartScope,
            cart: EMPTY_CART,
            error: errorMessage,
          });

          showError(errorMessage);
        }
      }
    }

    void synchronizeCart();

    return () => {
      cancelled = true;
    };
  }, [currentCartScope, showError, showSuccess, showWarning]);

  const reloadCart = useCallback(async (): Promise<void> => {
    const operationScope = currentCartScope;

    if (operationScope === null) {
      return;
    }

    setIsReloading(true);

    setScopedCartState((currentState) => {
      if (currentState.scope !== operationScope) {
        return currentState;
      }

      return {
        ...currentState,
        error: null,
      };
    });

    try {
      const loadedCart = await cartService.getCart();

      setScopedCartState({
        scope: operationScope,
        cart: loadedCart,
        error: null,
      });
    } catch (caughtError) {
      const errorMessage = getErrorMessage(caughtError);

      setScopedCartState((currentState) => ({
        scope: operationScope,

        cart:
          currentState.scope === operationScope
            ? currentState.cart
            : EMPTY_CART,

        error: errorMessage,
      }));

      showError(errorMessage);
    } finally {
      setIsReloading(false);
    }
  }, [currentCartScope, showError]);

  const runCartOperation = useCallback(
    async (operation: () => Promise<Cart>): Promise<void> => {
      const operationScope = currentCartScope;

      if (operationScope === null) {
        return;
      }

      setIsUpdating(true);

      setScopedCartState((currentState) => {
        if (currentState.scope !== operationScope) {
          return currentState;
        }

        return {
          ...currentState,
          error: null,
        };
      });

      try {
        const updatedCart = await operation();

        setScopedCartState({
          scope: operationScope,
          cart: updatedCart,
          error: null,
        });
      } catch (caughtError) {
        const errorMessage = getErrorMessage(caughtError);

        setScopedCartState((currentState) => ({
          scope: operationScope,

          cart:
            currentState.scope === operationScope
              ? currentState.cart
              : EMPTY_CART,

          error: errorMessage,
        }));

        showError(errorMessage);
      } finally {
        setIsUpdating(false);
      }
    },
    [currentCartScope, showError],
  );

  const addItem = useCallback(
    async (productId: number, quantity = 1): Promise<void> => {
      await runCartOperation(() =>
        cartService.addItem({
          productId,
          quantity,
        }),
      );
    },
    [runCartOperation],
  );

  const updateItem = useCallback(
    async (productId: number, quantity: number): Promise<void> => {
      await runCartOperation(() =>
        cartService.updateItem({
          productId,
          quantity,
        }),
      );
    },
    [runCartOperation],
  );

  const removeItem = useCallback(
    async (productId: number): Promise<void> => {
      await runCartOperation(() => cartService.removeItem(productId));
    },
    [runCartOperation],
  );

  const clearCart = useCallback(async (): Promise<void> => {
    await runCartOperation(() => cartService.clearCart());
  }, [runCartOperation]);

  const hasLoadedCurrentCart =
    currentCartScope !== null && scopedCartState.scope === currentCartScope;

  const visibleCart = hasLoadedCurrentCart ? scopedCartState.cart : EMPTY_CART;

  const visibleError = hasLoadedCurrentCart ? scopedCartState.error : null;

  const visibleIsLoading =
    isAuthLoading ||
    currentCartScope === null ||
    !hasLoadedCurrentCart ||
    isReloading;

  const contextValue = useMemo<CartContextValue>(
    () => ({
      cart: visibleCart,

      isLoading: visibleIsLoading,

      isUpdating,
      error: visibleError,

      reloadCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
    }),
    [
      visibleCart,
      visibleIsLoading,
      isUpdating,
      visibleError,
      reloadCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}
