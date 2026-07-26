import { mockCartService } from "./mock-cart-service";
import type { CartService } from "./cart-service.types";

/*
 * Cart operations currently use browser storage.
 *
 * Application code depends on CartService rather
 * than directly depending on localStorage.
 */
export const cartService: CartService = mockCartService;
