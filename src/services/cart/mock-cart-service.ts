import type {
  AddCartItemRequest,
  Cart,
  CartItem,
  CartMergeResult,
  UpdateCartItemRequest,
} from "../../types/cart";

import type { Product } from "../../types/product";

import { authService } from "../auth/auth-service";

import {
  findMockProductById,
  loadMockProducts,
} from "../products/mock-product-store";

import type { CartService } from "./cart-service.types";

interface MockCartEntry {
  productId: number;
  quantity: number;
}

interface ParsedCartEntries {
  entries: MockCartEntry[];
  hadInvalidEntries: boolean;
}

interface SanitizedCartEntries {
  entries: MockCartEntry[];
  adjustedToStock: boolean;
}

interface LoadedCartEntries {
  entries: MockCartEntry[];
  adjustedToStock: boolean;
}

interface MergeEntriesResult {
  entries: MockCartEntry[];
  adjustedToStock: boolean;
}

const GUEST_CART_STORAGE_KEY = "shop.cart.guest";

const USER_CART_STORAGE_PREFIX = "shop.cart.user.";

function getUserCartStorageKey(userId: string): string {
  return `${USER_CART_STORAGE_PREFIX}${userId}`;
}

function findProduct(productId: number): Product {
  const product = findMockProductById(productId);

  if (!product) {
    throw new Error("Product was not found.");
  }

  return product;
}

function validateQuantity(product: Product, quantity: number): void {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Cart quantity must be a positive whole number.");
  }

  if (quantity > product.stock) {
    throw new Error(`Only ${product.stock} units are available.`);
  }
}

function isMockCartEntry(value: unknown): value is MockCartEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const entry = value as Partial<MockCartEntry>;

  return (
    typeof entry.productId === "number" &&
    Number.isInteger(entry.productId) &&
    entry.productId > 0 &&
    typeof entry.quantity === "number" &&
    Number.isInteger(entry.quantity) &&
    entry.quantity > 0
  );
}

function parseCartEntries(storedValue: string | null): ParsedCartEntries {
  if (!storedValue) {
    return {
      entries: [],
      hadInvalidEntries: false,
    };
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return {
        entries: [],
        hadInvalidEntries: true,
      };
    }

    const entries = parsedValue.filter(isMockCartEntry);

    return {
      entries,
      hadInvalidEntries: entries.length !== parsedValue.length,
    };
  } catch {
    return {
      entries: [],
      hadInvalidEntries: true,
    };
  }
}

function sanitizeCartEntries(entries: MockCartEntry[]): SanitizedCartEntries {
  const productsById = new Map(
    loadMockProducts().map((product) => [product.id, product]),
  );

  const sanitizedEntries: MockCartEntry[] = [];

  let adjustedToStock = false;

  for (const entry of entries) {
    const product = productsById.get(entry.productId);

    /*
     * An administrator may have deleted the
     * product or changed its stock to zero.
     * In that case, remove the stale cart item.
     */
    if (!product || product.stock < 1) {
      adjustedToStock = true;
      continue;
    }

    const availableQuantity = Math.min(entry.quantity, product.stock);

    if (availableQuantity !== entry.quantity) {
      adjustedToStock = true;
    }

    /*
     * Duplicate entries should not normally
     * exist, but localStorage may contain
     * manually edited or old data.
     */
    const existingEntry = sanitizedEntries.find(
      (currentEntry) => currentEntry.productId === entry.productId,
    );

    if (existingEntry) {
      const requestedQuantity = existingEntry.quantity + availableQuantity;

      const mergedQuantity = Math.min(requestedQuantity, product.stock);

      if (mergedQuantity < requestedQuantity) {
        adjustedToStock = true;
      }

      existingEntry.quantity = mergedQuantity;

      continue;
    }

    sanitizedEntries.push({
      productId: entry.productId,
      quantity: availableQuantity,
    });
  }

  return {
    entries: sanitizedEntries,
    adjustedToStock,
  };
}

function saveCartEntries(storageKey: string, entries: MockCartEntry[]): void {
  window.localStorage.setItem(storageKey, JSON.stringify(entries));
}

function loadCartEntries(storageKey: string): LoadedCartEntries {
  const parsedResult = parseCartEntries(
    window.localStorage.getItem(storageKey),
  );

  const sanitizedResult = sanitizeCartEntries(parsedResult.entries);

  if (parsedResult.hadInvalidEntries || sanitizedResult.adjustedToStock) {
    saveCartEntries(storageKey, sanitizedResult.entries);
  }

  return {
    entries: sanitizedResult.entries,

    adjustedToStock:
      parsedResult.hadInvalidEntries || sanitizedResult.adjustedToStock,
  };
}

async function getCurrentStorageKey(): Promise<string> {
  const session = await authService.getSession();

  if (!session) {
    return GUEST_CART_STORAGE_KEY;
  }

  return getUserCartStorageKey(session.user.id);
}

function buildCart(entries: MockCartEntry[]): Cart {
  const productsById = new Map(
    loadMockProducts().map((product) => [product.id, product]),
  );

  const items: CartItem[] = entries.flatMap((entry) => {
    const product = productsById.get(entry.productId);

    if (!product) {
      return [];
    }

    return [
      {
        product,
        quantity: entry.quantity,
        lineTotal: product.price * entry.quantity,
      },
    ];
  });

  return {
    items,

    totalQuantity: items.reduce((total, item) => total + item.quantity, 0),

    subtotal: items.reduce((total, item) => total + item.lineTotal, 0),
  };
}

function mergeCartEntries(
  userEntries: MockCartEntry[],
  guestEntries: MockCartEntry[],
): MergeEntriesResult {
  const productsById = new Map(
    loadMockProducts().map((product) => [product.id, product]),
  );

  const mergedEntries = userEntries.map((entry) => ({
    ...entry,
  }));

  let adjustedToStock = false;

  for (const guestEntry of guestEntries) {
    const product = productsById.get(guestEntry.productId);

    if (!product || product.stock < 1) {
      adjustedToStock = true;
      continue;
    }

    const existingEntry = mergedEntries.find(
      (entry) => entry.productId === guestEntry.productId,
    );

    if (existingEntry) {
      const requestedQuantity = existingEntry.quantity + guestEntry.quantity;

      const mergedQuantity = Math.min(requestedQuantity, product.stock);

      if (mergedQuantity < requestedQuantity) {
        adjustedToStock = true;
      }

      existingEntry.quantity = mergedQuantity;

      continue;
    }

    const mergedQuantity = Math.min(guestEntry.quantity, product.stock);

    if (mergedQuantity < guestEntry.quantity) {
      adjustedToStock = true;
    }

    mergedEntries.push({
      productId: guestEntry.productId,

      quantity: mergedQuantity,
    });
  }

  return {
    entries: mergedEntries,
    adjustedToStock,
  };
}

export const mockCartService: CartService = {
  async getCart() {
    const storageKey = await getCurrentStorageKey();

    const loadResult = loadCartEntries(storageKey);

    return buildCart(loadResult.entries);
  },

  async mergeGuestCart(): Promise<CartMergeResult> {
    const session = await authService.getSession();

    if (!session) {
      const guestResult = loadCartEntries(GUEST_CART_STORAGE_KEY);

      return {
        cart: buildCart(guestResult.entries),
        merged: false,
        adjustedToStock: guestResult.adjustedToStock,
      };
    }

    const userStorageKey = getUserCartStorageKey(session.user.id);

    const userResult = loadCartEntries(userStorageKey);

    const guestResult = loadCartEntries(GUEST_CART_STORAGE_KEY);

    if (guestResult.entries.length === 0) {
      return {
        cart: buildCart(userResult.entries),
        merged: false,
        adjustedToStock:
          userResult.adjustedToStock || guestResult.adjustedToStock,
      };
    }

    const mergeResult = mergeCartEntries(
      userResult.entries,
      guestResult.entries,
    );

    saveCartEntries(userStorageKey, mergeResult.entries);

    window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);

    return {
      cart: buildCart(mergeResult.entries),

      merged: true,

      adjustedToStock:
        userResult.adjustedToStock ||
        guestResult.adjustedToStock ||
        mergeResult.adjustedToStock,
    };
  },

  async addItem(request: AddCartItemRequest) {
    const storageKey = await getCurrentStorageKey();

    let entries = loadCartEntries(storageKey).entries;

    const product = findProduct(request.productId);

    const existingEntry = entries.find(
      (entry) => entry.productId === request.productId,
    );

    const newQuantity = (existingEntry?.quantity ?? 0) + request.quantity;

    validateQuantity(product, newQuantity);

    if (existingEntry) {
      existingEntry.quantity = newQuantity;
    } else {
      entries = [
        ...entries,
        {
          productId: request.productId,

          quantity: request.quantity,
        },
      ];
    }

    saveCartEntries(storageKey, entries);

    return buildCart(entries);
  },

  async updateItem(request: UpdateCartItemRequest) {
    const storageKey = await getCurrentStorageKey();

    const entries = loadCartEntries(storageKey).entries;

    const product = findProduct(request.productId);

    validateQuantity(product, request.quantity);

    const existingEntry = entries.find(
      (entry) => entry.productId === request.productId,
    );

    if (!existingEntry) {
      throw new Error("Cart item was not found.");
    }

    existingEntry.quantity = request.quantity;

    saveCartEntries(storageKey, entries);

    return buildCart(entries);
  },

  async removeItem(productId: number) {
    const storageKey = await getCurrentStorageKey();

    const entries = loadCartEntries(storageKey).entries.filter(
      (entry) => entry.productId !== productId,
    );

    saveCartEntries(storageKey, entries);

    return buildCart(entries);
  },

  async clearCart() {
    const storageKey = await getCurrentStorageKey();

    saveCartEntries(storageKey, []);

    return buildCart([]);
  },
};
