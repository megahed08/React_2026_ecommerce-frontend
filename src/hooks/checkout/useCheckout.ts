import { useCallback, useState } from "react";

import { checkoutService } from "../../services/checkout/checkout-service";
import type { CreateOrderRequest } from "../../types/checkout";
import type { Order } from "../../types/order";

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "The order could not be created.";
}

export function useCheckout() {
  const [order, setOrder] = useState<Order | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(
    async (request: CreateOrderRequest): Promise<Order | null> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const createdOrder = await checkoutService.createOrder(request);

        setOrder(createdOrder);

        return createdOrder;
      } catch (caughtError) {
        setError(getErrorMessage(caughtError));

        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const resetCheckout = useCallback(() => {
    setOrder(null);
    setError(null);
    setIsSubmitting(false);
  }, []);

  return {
    order,
    isSubmitting,
    error,

    createOrder,
    resetCheckout,
  };
}
