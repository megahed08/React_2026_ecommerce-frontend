import { createContext } from "react";

import type { Cart } from "../../types/cart";

export interface CartContextValue {
  cart: Cart;

  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  reloadCart: () => Promise<void>;

  addItem: (productId: number, quantity?: number) => Promise<void>;

  updateItem: (productId: number, quantity: number) => Promise<void>;

  removeItem: (productId: number) => Promise<void>;

  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);
