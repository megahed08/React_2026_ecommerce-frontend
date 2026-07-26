const STORAGE_KEY = "shop.recent-order-confirmation";

const CONFIRMATION_MAX_AGE_MS = 10 * 60 * 1000;

interface StoredOrderConfirmation {
  orderId: string;
  placedAt: number;
}

export function markOrderAsRecentlyPlaced(orderId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const confirmation: StoredOrderConfirmation = {
    orderId,
    placedAt: Date.now(),
  };

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(confirmation));
}

export function isRecentOrderConfirmation(orderId: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const storedValue = window.sessionStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return false;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (typeof parsedValue !== "object" || parsedValue === null) {
      return false;
    }

    const confirmation = parsedValue as Partial<StoredOrderConfirmation>;

    if (
      confirmation.orderId !== orderId ||
      typeof confirmation.placedAt !== "number"
    ) {
      return false;
    }

    const confirmationAge = Date.now() - confirmation.placedAt;

    return confirmationAge >= 0 && confirmationAge <= CONFIRMATION_MAX_AGE_MS;
  } catch {
    return false;
  }
}
