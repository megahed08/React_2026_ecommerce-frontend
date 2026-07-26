import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { Cart } from "../../types/cart";
import { formatCurrency } from "../../utils/currency/formatCurrency";

interface CheckoutSummaryProps {
  cart: Cart;
}

export function CheckoutSummary({ cart }: CheckoutSummaryProps) {
  return (
    <Paper
      component="aside"
      variant="outlined"
      sx={{
        p: {
          xs: 2,
          sm: 3,
        },
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

        <Stack spacing={2}>
          {cart.items.map((item) => (
            <Box
              key={item.product.id}
              sx={{
                display: "grid",
                gridTemplateColumns: "64px minmax(0, 1fr) auto",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src={item.product.image}
                alt={item.product.name}
                sx={{
                  width: 64,
                  height: 64,
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {item.product.name}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Quantity: {item.quantity}
                </Typography>
              </Box>

              <Typography variant="body2">
                {formatCurrency(item.lineTotal)}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Divider />

        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Typography color="text.secondary">Products</Typography>

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
            gap: 2,
          }}
        >
          <Typography color="text.secondary">Shipping</Typography>

          <Typography
            variant="body2"
            sx={{
              textAlign: "right",
            }}
          >
            Calculated when placing the order
          </Typography>
        </Stack>

        <Divider />

        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Current subtotal</Typography>

          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
            }}
          >
            {formatCurrency(cart.subtotal)}
          </Typography>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Final shipping costs and total are validated by the checkout service
          when the order is created.
        </Typography>
      </Stack>
    </Paper>
  );
}
