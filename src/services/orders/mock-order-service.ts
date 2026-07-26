import { authService } from "../auth/auth-service";

import { findAllMockOrders, findMockOrder } from "./mock-order-store";

import type { OrderService } from "./order-service.types";

async function getCurrentCustomerId(): Promise<string> {
  const session = await authService.getSession();

  if (!session) {
    throw new Error("You must be logged in to view orders.");
  }

  return session.user.id;
}

export const mockOrderService: OrderService = {
  async getOrderById(orderId: string) {
    const customerId = await getCurrentCustomerId();

    return findMockOrder(orderId, customerId);
  },

  async getOrders() {
    const customerId = await getCurrentCustomerId();

    return findAllMockOrders(customerId);
  },
};
