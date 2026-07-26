import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { Order } from "../../types/order";
import { formatCurrency } from "../../utils/currency/formatCurrency";

interface OrderDetailsCardProps {
  order: Order;
}

export function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(order.createdAt));

  const paymentMethod =
    order.paymentMethod === "card" ? "Card" : "Cash on delivery";

  return (
    <Paper
      variant="outlined"
      sx={{
        p: {
          xs: 2,
          sm: 4,
        },
      }}
    >
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography>
            <strong>Order ID:</strong> {order.id}
          </Typography>

          <Typography>
            <strong>Date:</strong> {formattedDate}
          </Typography>

          <Typography>
            <strong>Status:</strong> {order.status}
          </Typography>

          <Typography>
            <strong>Payment:</strong> {paymentMethod}
          </Typography>
        </Stack>

        <Divider />

        <Box>
          <Typography component="h2" variant="h6" gutterBottom>
            Ordered products
          </Typography>

          <Stack spacing={2}>
            {order.items.map((item) => (
              <Box
                key={item.productId}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "64px minmax(0, 1fr)",
                    sm: "64px minmax(0, 1fr) auto",
                  },
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: 64,
                    height: 64,
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    gridColumn: {
                      xs: "1 / -1",
                      sm: "auto",
                    },
                    textAlign: {
                      xs: "right",
                      sm: "initial",
                    },
                  }}
                >
                  {formatCurrency(item.lineTotal)}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Divider />

        <Stack spacing={1}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Typography color="text.secondary">Subtotal</Typography>

            <Typography>{formatCurrency(order.subtotal)}</Typography>
          </Stack>

          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Typography color="text.secondary">Shipping</Typography>

            <Typography>
              {order.shippingCost === 0
                ? "Free"
                : formatCurrency(order.shippingCost)}
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
            <Typography variant="h6">Total</Typography>

            <Typography
              variant="h5"
              sx={{
                color: "primary.main",
              }}
            >
              {formatCurrency(order.total)}
            </Typography>
          </Stack>
        </Stack>

        <Divider />

        <Box>
          <Typography component="h2" variant="h6" gutterBottom>
            Shipping address
          </Typography>

          <Typography>
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </Typography>

          <Typography>{order.shippingAddress.street}</Typography>

          <Typography>
            {order.shippingAddress.postalCode} {order.shippingAddress.city}
          </Typography>

          <Typography>{order.shippingAddress.country}</Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            {order.shippingAddress.email}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {order.shippingAddress.phone}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
