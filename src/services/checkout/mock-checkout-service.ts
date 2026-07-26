import type {
  CreateOrderRequest,
  PaymentMethod,
  ShippingAddress,
} from "../../types/checkout";

import type { Order, OrderItem } from "../../types/order";

import type { Product } from "../../types/product";

import { authService } from "../auth/auth-service";
import { saveMockOrder } from "../orders/mock-order-store";
import { loadMockProducts } from "../products/mock-product-store";

import type { CheckoutService } from "./checkout-service.types";

const FREE_SHIPPING_THRESHOLD = 100;
const STANDARD_SHIPPING_COST = 5.99;

function createOrderId(): string {
  return crypto.randomUUID();
}

function createProductsById(products: Product[]): Map<number, Product> {
  return new Map(products.map((product) => [product.id, product]));
}

function validateShippingAddress(address: ShippingAddress): void {
  const requiredValues = [
    address.firstName,
    address.lastName,
    address.email,
    address.phone,
    address.street,
    address.city,
    address.postalCode,
    address.country,
  ];

  const hasMissingValue = requiredValues.some((value) => value.trim() === "");

  if (hasMissingValue) {
    throw new Error(
      "Complete all shipping information before placing the order.",
    );
  }
}

function validatePaymentMethod(paymentMethod: PaymentMethod): void {
  if (paymentMethod !== "card" && paymentMethod !== "cash-on-delivery") {
    throw new Error("Select a valid payment method.");
  }
}

function validateOrderRequest(
  request: CreateOrderRequest,
  productsById: Map<number, Product>,
): void {
  if (request.items.length === 0) {
    throw new Error("An order must contain at least one product.");
  }

  validateShippingAddress(request.shippingAddress);

  validatePaymentMethod(request.paymentMethod);

  const requestedProductIds = new Set<number>();

  for (const requestedItem of request.items) {
    if (requestedProductIds.has(requestedItem.productId)) {
      throw new Error(
        "The same product cannot appear more than once in an order.",
      );
    }

    requestedProductIds.add(requestedItem.productId);

    const product = productsById.get(requestedItem.productId);

    if (!product) {
      throw new Error(`Product ${requestedItem.productId} was not found.`);
    }

    if (
      !Number.isInteger(requestedItem.quantity) ||
      requestedItem.quantity < 1
    ) {
      throw new Error("Product quantity must be a positive whole number.");
    }

    if (product.stock < 1) {
      throw new Error(`${product.name} is out of stock.`);
    }

    if (requestedItem.quantity > product.stock) {
      throw new Error(
        `Only ${product.stock} units of ${product.name} are available.`,
      );
    }
  }
}

function buildOrderItems(
  request: CreateOrderRequest,
  productsById: Map<number, Product>,
): OrderItem[] {
  return request.items.map((requestedItem) => {
    const product = productsById.get(requestedItem.productId);

    /*
     * validateOrderRequest runs before this
     * function, so this condition should only
     * protect against unexpected bad data.
     */
    if (!product) {
      throw new Error("Product was not found.");
    }

    const lineTotal = product.price * requestedItem.quantity;

    return {
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice: product.price,
      quantity: requestedItem.quantity,
      lineTotal,
    };
  });
}

function calculateSubtotal(items: OrderItem[]): number {
  return items.reduce((total, item) => total + item.lineTotal, 0);
}

function calculateShippingCost(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
}

function normalizeShippingAddress(address: ShippingAddress): ShippingAddress {
  return {
    firstName: address.firstName.trim(),

    lastName: address.lastName.trim(),

    email: address.email.trim().toLowerCase(),

    phone: address.phone.trim(),
    street: address.street.trim(),
    city: address.city.trim(),

    postalCode: address.postalCode.trim(),

    country: address.country.trim(),
  };
}

export const mockCheckoutService: CheckoutService = {
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const session = await authService.getSession();

    if (!session) {
      throw new Error("You must be logged in to place an order.");
    }

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 500);
    });

    /*
     * Read the current catalog after the
     * simulated delay so checkout validates
     * against the latest admin changes.
     */
    const products = loadMockProducts();

    const productsById = createProductsById(products);

    validateOrderRequest(request, productsById);

    const items = buildOrderItems(request, productsById);

    const subtotal = calculateSubtotal(items);

    const shippingCost = calculateShippingCost(subtotal);

    const order: Order = {
      id: createOrderId(),

      customerId: session.user.id,

      createdAt: new Date().toISOString(),

      status: "pending",

      items,

      shippingAddress: normalizeShippingAddress(request.shippingAddress),

      paymentMethod: request.paymentMethod,

      subtotal,
      shippingCost,

      total: subtotal + shippingCost,
    };

    saveMockOrder(order);

    return order;
  },
};
