import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { Product } from "../../types/product";
import { formatCurrency } from "../../utils/currency/formatCurrency";
import { QuantitySelector } from "../cart/QuantitySelector";

interface ProductDetailsProps {
  product: Product;
  isCartUpdating?: boolean;
  onAddToCart?: (product: Product, quantity: number) => void | Promise<void>;
}

export function ProductDetails({
  product,
  isCartUpdating = false,
  onAddToCart,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = product.stock === 0;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "minmax(0, 1fr) minmax(0, 1fr)",
        },
        gap: 4,
      }}
    >
      <Box
        component="img"
        src={product.image}
        alt={product.name}
        sx={{
          width: "100%",
          height: {
            xs: 320,
            md: 500,
          },
          objectFit: "cover",
          borderRadius: 2,
        }}
      />

      <Stack
        spacing={2}
        sx={{
          alignItems: "flex-start",
        }}
      >
        <Chip label={product.category} color="secondary" size="small" />

        <Typography component="h1" variant="h3">
          {product.name}
        </Typography>

        <Typography color="text.secondary">Rating: {product.rating}</Typography>

        <Typography variant="body1">{product.description}</Typography>

        <Typography
          variant="h4"
          sx={{
            color: "primary.main",
          }}
        >
          {formatCurrency(product.price)}
        </Typography>

        <Typography
          sx={{
            color: isOutOfStock ? "error.main" : "success.main",
          }}
        >
          {isOutOfStock
            ? "Out of stock"
            : `${product.stock} products available`}
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          sx={{
            width: "100%",
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
          }}
        >
          <QuantitySelector
            value={quantity}
            max={Math.max(product.stock, 1)}
            disabled={isOutOfStock || isCartUpdating}
            onChange={setQuantity}
          />

          <Button
            variant="contained"
            size="large"
            disabled={isOutOfStock || isCartUpdating}
            onClick={() => {
              void onAddToCart?.(product, quantity);
            }}
          >
            {isCartUpdating ? "Updating cart..." : "Add to cart"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
