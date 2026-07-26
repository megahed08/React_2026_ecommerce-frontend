import type { PaymentMethod, ShippingAddress } from "./checkout";

export type OrderStatus = "pending" | "confirmed" | "cancelled";

export interface OrderItem {
  productId: number;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  customerId: string;
  createdAt: string;
  status: OrderStatus;

  items: OrderItem[];

  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;

  subtotal: number;
  shippingCost: number;
  total: number;
}
