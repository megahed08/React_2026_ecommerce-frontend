import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from "../../types/product";

import type { ProductPage, ProductQuery } from "../../types/product-query";

import {
  findMockProductById,
  getNextMockProductId,
  loadMockProducts,
  resetMockProducts,
  saveMockProducts,
} from "./mock-product-store";

import type { ProductService } from "./product-service.types";

function applyProductQuery(
  products: Product[],
  query: ProductQuery,
): ProductPage {
  const normalizedSearch = query.search.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      normalizedSearch === "" ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.description.toLowerCase().includes(normalizedSearch);

    const matchesCategory =
      query.category === "all" || product.category === query.category;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts];

  if (query.sortBy !== "featured") {
    const directionMultiplier = query.sortDirection === "asc" ? 1 : -1;

    sortedProducts.sort((firstProduct, secondProduct) => {
      switch (query.sortBy) {
        case "price":
          return (
            (firstProduct.price - secondProduct.price) * directionMultiplier
          );

        case "rating":
          return (
            (firstProduct.rating - secondProduct.rating) * directionMultiplier
          );

        case "name":
          return (
            firstProduct.name.localeCompare(secondProduct.name) *
            directionMultiplier
          );

        default:
          return 0;
      }
    });
  }

  const startIndex = query.page * query.pageSize;

  const items = sortedProducts.slice(startIndex, startIndex + query.pageSize);

  return {
    items,
    totalItems: sortedProducts.length,
    page: query.page,
    pageSize: query.pageSize,
    totalPages: Math.ceil(sortedProducts.length / query.pageSize),
  };
}

function normalizeProductRequest(
  request: CreateProductRequest | UpdateProductRequest,
): CreateProductRequest {
  return {
    name: request.name.trim(),
    category: request.category.trim(),
    price: request.price,
    rating: request.rating,
    stock: request.stock,
    image: request.image.trim(),
    description: request.description.trim(),
  };
}

function validateProductRequest(request: CreateProductRequest): void {
  if (!request.name) {
    throw new Error("Product name is required.");
  }

  if (!request.category) {
    throw new Error("Product category is required.");
  }

  if (!Number.isFinite(request.price) || request.price < 0) {
    throw new Error("Product price must be zero or greater.");
  }

  if (
    !Number.isFinite(request.rating) ||
    request.rating < 0 ||
    request.rating > 5
  ) {
    throw new Error("Product rating must be between 0 and 5.");
  }

  if (!Number.isInteger(request.stock) || request.stock < 0) {
    throw new Error("Product stock must be a whole number of zero or greater.");
  }

  if (!request.image) {
    throw new Error("Product image URL is required.");
  }

  if (!request.description) {
    throw new Error("Product description is required.");
  }
}

function prepareProductRequest(
  request: CreateProductRequest | UpdateProductRequest,
): CreateProductRequest {
  const normalizedRequest = normalizeProductRequest(request);

  validateProductRequest(normalizedRequest);

  return normalizedRequest;
}

export const mockProductService: ProductService = {
  async getProducts(query) {
    const products = loadMockProducts();

    return applyProductQuery(products, query);
  },

  async getProductById(id) {
    return findMockProductById(id);
  },

  async getCategories() {
    const products = loadMockProducts();

    return Array.from(
      new Set(products.map((product) => product.category)),
    ).sort((first, second) => first.localeCompare(second));
  },

  async getAllProducts() {
    return loadMockProducts().sort(
      (firstProduct, secondProduct) => firstProduct.id - secondProduct.id,
    );
  },

  async createProduct(request) {
    const preparedRequest = prepareProductRequest(request);

    const products = loadMockProducts();

    const createdProduct: Product = {
      id: getNextMockProductId(products),
      ...preparedRequest,
    };

    saveMockProducts([...products, createdProduct]);

    return {
      ...createdProduct,
    };
  },

  async updateProduct(id, request) {
    const products = loadMockProducts();

    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      return null;
    }

    const preparedRequest = prepareProductRequest(request);

    const updatedProduct: Product = {
      id,
      ...preparedRequest,
    };

    const updatedProducts = [...products];

    updatedProducts[productIndex] = updatedProduct;

    saveMockProducts(updatedProducts);

    return {
      ...updatedProduct,
    };
  },

  async deleteProduct(id) {
    const products = loadMockProducts();

    const updatedProducts = products.filter((product) => product.id !== id);

    if (updatedProducts.length === products.length) {
      return false;
    }

    saveMockProducts(updatedProducts);

    return true;
  },

  async resetProducts() {
    const products = resetMockProducts();

    return products.map((product) => ({
      ...product,
    }));
  },
};
