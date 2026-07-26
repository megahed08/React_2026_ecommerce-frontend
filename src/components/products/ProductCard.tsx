import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import type { Product } from "../../types/product";
import { formatCurrency } from "../../utils/currency/formatCurrency";
import { useState } from "react";
import { QuantitySelector } from "../cart/QuantitySelector";

interface ProductCardProps {
  product: Product;
  isCartUpdating?: boolean;
  onAddToCart?: (product: Product, quantity: number) => void | Promise<void>;
}

export function ProductCard({
  product,
  isCartUpdating = false,
  onAddToCart,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia
        component="img"
        height="220"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ flex: 1 }}>
        <Stack spacing={1}>
          <Chip
            label={product.category}
            size="small"
            sx={{ alignSelf: "flex-start" }}
          />

          <Typography
            component={Link}
            to={`/products/${product.id}`}
            variant="h6"
            color="primary"
            sx={{
              textDecoration: "none",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            {product.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Rating: {product.rating}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
          </Typography>

          <Typography variant="h6" color="primary.main">
            {formatCurrency(product.price)}
          </Typography>
        </Stack>
      </CardContent>

      <CardActions
        sx={{
          display: "flex",
          gap: 1,
          px: 2,
          pb: 2,
        }}
      >
        <QuantitySelector
          value={quantity}
          max={product.stock}
          disabled={product.stock === 0 || isCartUpdating}
          onChange={setQuantity}
        />

        <Button
          fullWidth
          variant="contained"
          disabled={product.stock === 0 || isCartUpdating}
          onClick={() => {
            void onAddToCart?.(product, quantity);
          }}
        >
          {isCartUpdating ? "Updating..." : "Add to cart"}
        </Button>
      </CardActions>
    </Card>
  );
}
