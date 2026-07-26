export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export type PaymentMethod = "card" | "cash-on-delivery";

export interface CheckoutFormValues {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

export interface CheckoutItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: CheckoutItemRequest[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}
