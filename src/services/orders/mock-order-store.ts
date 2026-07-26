import type { Order } from "../../types/order";

const ORDER_STORAGE_KEY = "shop.orders";

function isStoredOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const order = value as Partial<Order>;

  return (
    typeof order.id === "string" &&
    typeof order.customerId === "string" &&
    typeof order.createdAt === "string" &&
    typeof order.status === "string" &&
    Array.isArray(order.items) &&
    typeof order.subtotal === "number" &&
    typeof order.shippingCost === "number" &&
    typeof order.total === "number"
  );
}

function loadOrders(): Order[] {
  try {
    const storedValue = window.localStorage.getItem(ORDER_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isStoredOrder);
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]): void {
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

export function saveMockOrder(order: Order): void {
  const storedOrders = loadOrders();

  const updatedOrders = [
    order,
    ...storedOrders.filter((storedOrder) => storedOrder.id !== order.id),
  ];

  saveOrders(updatedOrders);
}

export function findMockOrder(
  orderId: string,
  customerId: string,
): Order | null {
  return (
    loadOrders().find(
      (order) => order.id === orderId && order.customerId === customerId,
    ) ?? null
  );
}

export function findAllMockOrders(customerId: string): Order[] {
  return loadOrders().filter((order) => order.customerId === customerId);
}
