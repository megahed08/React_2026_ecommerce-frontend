import Box from "@mui/material/Box";
import type { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isCartUpdating?: boolean;
  onAddToCart?: (product: Product, quantity: number) => void | Promise<void>;
}

export function ProductGrid({
  products,
  isCartUpdating = false,
  onAddToCart,
}: ProductGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
        },
        gap: 3,
      }}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isCartUpdating={isCartUpdating}
          onAddToCart={onAddToCart}
        />
      ))}
    </Box>
  );
}
