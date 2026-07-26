import { useCallback, useEffect, useState } from "react";

import { orderService } from "../../services/orders/order-service";
import type { Order } from "../../types/order";

interface OrderLoadState {
  loadedOrderId: string | null;
  loadedReloadVersion: number;
  order: Order | null;
  error: string | null;
}

interface UseOrderResult {
  order: Order | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

const INITIAL_STATE: OrderLoadState = {
  loadedOrderId: null,
  loadedReloadVersion: -1,
  order: null,
  error: null,
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "The order could not be loaded.";
}

export function useOrder(orderId: string | undefined): UseOrderResult {
  const normalizedOrderId = orderId?.trim() || null;

  const [reloadVersion, setReloadVersion] = useState(0);

  const [state, setState] = useState<OrderLoadState>(INITIAL_STATE);

  useEffect(() => {
    if (normalizedOrderId === null) {
      return;
    }

    const requestedOrderId = normalizedOrderId;

    const requestedReloadVersion = reloadVersion;

    let cancelled = false;

    async function loadOrder(): Promise<void> {
      try {
        const loadedOrder = await orderService.getOrderById(requestedOrderId);

        if (cancelled) {
          return;
        }

        setState({
          loadedOrderId: requestedOrderId,

          loadedReloadVersion: requestedReloadVersion,

          order: loadedOrder,
          error: null,
        });
      } catch (caughtError) {
        if (cancelled) {
          return;
        }

        setState({
          loadedOrderId: requestedOrderId,

          loadedReloadVersion: requestedReloadVersion,

          order: null,
          error: getErrorMessage(caughtError),
        });
      }
    }

    void loadOrder();

    return () => {
      cancelled = true;
    };
  }, [normalizedOrderId, reloadVersion]);

  const reload = useCallback((): void => {
    setReloadVersion((currentVersion) => currentVersion + 1);
  }, []);

  if (normalizedOrderId === null) {
    return {
      order: null,
      isLoading: false,
      error: "Order ID is missing.",
      reload,
    };
  }

  const hasLoadedCurrentRequest =
    state.loadedOrderId === normalizedOrderId &&
    state.loadedReloadVersion === reloadVersion;

  if (!hasLoadedCurrentRequest) {
    return {
      order: null,
      isLoading: true,
      error: null,
      reload,
    };
  }

  return {
    order: state.order,
    isLoading: false,
    error: state.error,
    reload,
  };
}
