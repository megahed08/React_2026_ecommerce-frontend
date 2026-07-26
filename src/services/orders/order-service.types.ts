import type { Order } from "../../types/order";

export interface OrderService {
  getOrderById(orderId: string): Promise<Order | null>;

  getOrders(): Promise<Order[]>;
}
