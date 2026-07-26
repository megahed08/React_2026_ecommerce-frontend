import { mockProductService } from "./mock-product-service";
import type { ProductService } from "./product-service.types";

/*
 * The standalone frontend uses the mock
 * implementation.
 *
 * Components and hooks depend on ProductService,
 * so a future API implementation can replace this
 * selection without changing application code.
 */
export const productService: ProductService = mockProductService;
