import type { CreateOrderRequest } from "../../types/checkout";
import type { Order } from "../../types/order";

export interface CheckoutService {
  createOrder(request: CreateOrderRequest): Promise<Order>;
}
