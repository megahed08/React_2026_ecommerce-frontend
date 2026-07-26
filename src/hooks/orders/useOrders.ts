import { useCallback, useEffect, useState } from "react";

import { orderService } from "../../services/orders/order-service";
import type { Order } from "../../types/order";

interface UseOrdersResult {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "The orders could not be loaded.";
}

export function useOrders(): UseOrdersResult {
  const [state, setState] = useState<OrdersState>({
    orders: [],
    isLoading: true,
    error: null,
  });

  const reload = useCallback(async (): Promise<void> => {
    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    try {
      const loadedOrders = await orderService.getOrders();

      setState({
        orders: loadedOrders,
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

  useEffect(() => {
    let cancelled = false;

    async function loadInitialOrders() {
      try {
        const loadedOrders = await orderService.getOrders();

        if (!cancelled) {
          setState({
            orders: loadedOrders,
            isLoading: false,
            error: null,
          });
        }
      } catch (caughtError) {
        if (!cancelled) {
          setState({
            orders: [],
            isLoading: false,
            error: getErrorMessage(caughtError),
          });
        }
      }
    }

    void loadInitialOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    orders: state.orders,
    isLoading: state.isLoading,
    error: state.error,
    reload,
  };
}
