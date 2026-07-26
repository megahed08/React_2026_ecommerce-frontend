import { mockCheckoutService } from "./mock-checkout-service";
import type { CheckoutService } from "./checkout-service.types";

/*
 * Checkout and order creation are simulated for
 * this frontend portfolio project.
 *
 * A future backend implementation can replace the
 * selected service without changing checkout hooks
 * or pages.
 */
export const checkoutService: CheckoutService = mockCheckoutService;
