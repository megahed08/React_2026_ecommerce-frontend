import type {
  AddCartItemRequest,
  Cart,
  CartMergeResult,
  UpdateCartItemRequest,
} from "../../types/cart";

export interface CartService {
  getCart(): Promise<Cart>;

  addItem(request: AddCartItemRequest): Promise<Cart>;

  updateItem(request: UpdateCartItemRequest): Promise<Cart>;

  removeItem(productId: number): Promise<Cart>;

  clearCart(): Promise<Cart>;

  mergeGuestCart(): Promise<CartMergeResult>;
}
