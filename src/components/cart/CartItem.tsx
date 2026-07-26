import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Link } from "react-router";

import type { CartItem as CartItemData } from "../../types/cart";
import { formatCurrency } from "../../utils/currency/formatCurrency";
import { QuantitySelector } from "./QuantitySelector";

interface CartItemProps {
  item: CartItemData;
  isUpdating?: boolean;

  onQuantityChange: (
    productId: number,
    quantity: number,
  ) => void | Promise<void>;

  onRemove: (productId: number) => void | Promise<void>;
}

export function CartItem({
  item,
  isUpdating = false,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const { product, quantity, lineTotal } = item;

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "80px minmax(0, 1fr)",
            sm: "110px minmax(0, 1fr) auto",
          },
          gap: 2,
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={product.image}
          alt={product.name}
          sx={{
            width: "100%",
            aspectRatio: "1",
            objectFit: "cover",
            borderRadius: 1,
          }}
        />

        <Stack spacing={1}>
          <Typography
            component={Link}
            to={`/products/${product.id}`}
            variant="h6"
            sx={{
              color: "text.primary",
              textDecoration: "none",

              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            {product.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {formatCurrency(product.price)} each
          </Typography>

          <QuantitySelector
            value={quantity}
            max={product.stock}
            disabled={isUpdating}
            onChange={(newQuantity) => {
              void onQuantityChange(product.id, newQuantity);
            }}
          />
        </Stack>

        <Stack
          spacing={1}
          sx={{
            gridColumn: {
              xs: "1 / -1",
              sm: "auto",
            },
            alignItems: {
              xs: "stretch",
              sm: "flex-end",
            },
          }}
        >
          <Typography variant="h6">{formatCurrency(lineTotal)}</Typography>

          <Tooltip title="Remove product">
            <IconButton
              aria-label={`Remove ${product.name} from cart`}
              color="error"
              disabled={isUpdating}
              onClick={() => {
                void onRemove(product.id);
              }}
            >
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Card>
  );
}
