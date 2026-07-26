import { mockOrderService } from "./mock-order-service";
import type { OrderService } from "./order-service.types";

/*
 * Order history currently reads from the local
 * mock order store.
 *
 * Pages depend on OrderService, allowing the
 * full-stack fork to use an API implementation.
 */
export const orderService: OrderService = mockOrderService;
