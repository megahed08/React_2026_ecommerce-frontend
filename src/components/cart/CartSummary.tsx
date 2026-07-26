import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Link } from "react-router";

import type { Cart } from "../../types/cart";
import { formatCurrency } from "../../utils/currency/formatCurrency";

interface CartSummaryProps {
  cart: Cart;
  isUpdating?: boolean;
}

export function CartSummary({ cart, isUpdating = false }: CartSummaryProps) {
  const isEmpty = cart.items.length === 0;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        position: {
          lg: "sticky",
        },
        top: {
          lg: 88,
        },
      }}
    >
      <Stack spacing={2}>
        <Typography component="h2" variant="h5">
          Order summary
        </Typography>

        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Typography color="text.secondary">Items</Typography>

          <Typography>{cart.totalQuantity}</Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Typography color="text.secondary">Subtotal</Typography>

          <Typography>{formatCurrency(cart.subtotal)}</Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Typography color="text.secondary">Shipping</Typography>

          <Typography variant="body2">Calculated at checkout</Typography>
        </Stack>

        <Divider />

        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Estimated total</Typography>

          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
            }}
          >
            {formatCurrency(cart.subtotal)}
          </Typography>
        </Stack>

        <Button
          component={Link}
          to="/checkout"
          variant="contained"
          size="large"
          fullWidth
          startIcon={<ShoppingBagRoundedIcon />}
          disabled={isEmpty || isUpdating}
        >
          Continue to checkout
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            textAlign: "center",
          }}
        >
          Shipping and taxes will be calculated during checkout.
        </Typography>
      </Stack>
    </Paper>
  );
}
