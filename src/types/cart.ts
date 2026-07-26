import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
}

export interface AddCartItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: number;
  quantity: number;
}

export interface CartMergeResult {
  cart: Cart;
  merged: boolean;
  adjustedToStock: boolean;
}
