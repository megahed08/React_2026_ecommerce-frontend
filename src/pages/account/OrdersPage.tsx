import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Link } from "react-router";

import { useOrders } from "../../hooks/orders/useOrders";
import type { OrderStatus } from "../../types/order";
import { formatCurrency } from "../../utils/currency/formatCurrency";

function formatOrderDate(createdAt: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));
}

function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "Pending";

    case "confirmed":
      return "Confirmed";

    case "cancelled":
      return "Cancelled";
  }
}

function getStatusColor(
  status: OrderStatus,
): "default" | "success" | "error" | "warning" {
  switch (status) {
    case "pending":
      return "warning";

    case "confirmed":
      return "success";

    case "cancelled":
      return "error";

    default:
      return "default";
  }
}

export function OrdersPage() {
  const { orders, isLoading, error, reload } = useOrders();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          My orders
        </Typography>

        <Typography color="text.secondary">
          View your previous orders and their current status.
        </Typography>
      </Box>

      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {!isLoading && error && (
        <Stack spacing={2}>
          <Alert severity="error">{error}</Alert>

          <Box>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                void reload();
              }}
            >
              Try again
            </Button>
          </Box>
        </Stack>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <Paper
          variant="outlined"
          sx={{
            p: {
              xs: 3,
              sm: 5,
            },
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <ReceiptLongRoundedIcon
              color="disabled"
              sx={{
                fontSize: 72,
              }}
            />

            <Typography
              component="h2"
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              No orders yet
            </Typography>

            <Typography color="text.secondary">
              Orders you place will appear here.
            </Typography>

            <Button component={Link} to="/products" variant="contained">
              Browse products
            </Button>
          </Stack>
        </Paper>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <Stack spacing={2}>
          {orders.map((order) => {
            const totalQuantity = order.items.reduce(
              (total, item) => total + item.quantity,
              0,
            );

            return (
              <Paper
                key={order.id}
                variant="outlined"
                sx={{
                  p: {
                    xs: 2,
                    sm: 3,
                  },
                }}
              >
                <Stack spacing={2}>
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={2}
                    sx={{
                      justifyContent: "space-between",

                      alignItems: {
                        xs: "flex-start",
                        sm: "center",
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Order ID
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {order.id}
                      </Typography>
                    </Box>

                    <Chip
                      label={getStatusLabel(order.status)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </Stack>

                  <Divider />

                  <Box
                    sx={{
                      display: "grid",

                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, 1fr)",
                      },

                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>

                      <Typography>
                        {formatOrderDate(order.createdAt)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Products
                      </Typography>

                      <Typography>{totalQuantity}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(order.total)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Button
                      component={Link}
                      to={`/account/orders/${order.id}`}
                      variant="outlined"
                    >
                      View order
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
