import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";

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

import { useAuth } from "../../hooks/auth/useAuth";
import { useOrders } from "../../hooks/orders/useOrders";
import type { OrderStatus } from "../../types/order";
import { formatCurrency } from "../../utils/currency/formatCurrency";

function formatOrderDate(createdAt: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
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
): "default" | "success" | "warning" | "error" {
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

export function AccountPage() {
  const { user } = useAuth();

  const { orders, isLoading, error, reload } = useOrders();

  if (!user) {
    return null;
  }

  const totalSpent = orders.reduce((total, order) => total + order.total, 0);

  const recentOrders = [...orders]
    .sort(
      (firstOrder, secondOrder) =>
        new Date(secondOrder.createdAt).getTime() -
        new Date(firstOrder.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <Stack spacing={3}>
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
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 700,
            }}
          >
            Welcome, {user.firstName}
          </Typography>

          <Typography color="text.secondary">
            View your profile and recent account activity.
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/account/profile"
          variant="outlined"
          startIcon={<ManageAccountsRoundedIcon />}
        >
          Edit profile
        </Button>
      </Stack>

      {error && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                void reload();
              }}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          sx={{
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
          }}
        >
          <AccountCircleRoundedIcon
            color="primary"
            sx={{
              fontSize: 64,
            }}
          />

          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
              }}
            >
              {user.firstName} {user.lastName}
            </Typography>

            <Typography color="text.secondary">{user.email}</Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                textTransform: "capitalize",
              }}
            >
              Role: {user.role}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },

          gap: 2,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            p: 3,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <ReceiptLongRoundedIcon
              color="primary"
              sx={{
                fontSize: 40,
              }}
            />

            <Box>
              <Typography variant="body2" color="text.secondary">
                Total orders
              </Typography>

              {isLoading ? (
                <CircularProgress size={24} />
              ) : error ? (
                <Typography
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Unavailable
                </Typography>
              ) : (
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {orders.length}
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 3,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <ShoppingBagRoundedIcon
              color="primary"
              sx={{
                fontSize: 40,
              }}
            />

            <Box>
              <Typography variant="body2" color="text.secondary">
                Total spent
              </Typography>

              {isLoading ? (
                <CircularProgress size={24} />
              ) : error ? (
                <Typography
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Unavailable
                </Typography>
              ) : (
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {formatCurrency(totalSpent)}
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Paper
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
            spacing={1}
            sx={{
              justifyContent: "space-between",

              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
            }}
          >
            <Box>
              <Typography
                component="h2"
                variant="h5"
                sx={{
                  fontWeight: 700,
                }}
              >
                Recent orders
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Your latest purchases.
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/account/orders"
              variant="outlined"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              View all orders
            </Button>
          </Stack>

          <Divider />

          {isLoading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 4,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {!isLoading && error && (
            <Stack
              spacing={1}
              sx={{
                py: 2,
                alignItems: "flex-start",
              }}
            >
              <Typography color="text.secondary">
                Recent orders could not be loaded.
              </Typography>

              <Button
                type="button"
                variant="text"
                onClick={() => {
                  void reload();
                }}
              >
                Try again
              </Button>
            </Stack>
          )}

          {!isLoading && !error && recentOrders.length === 0 && (
            <Stack
              spacing={2}
              sx={{
                alignItems: "flex-start",
                py: 2,
              }}
            >
              <Typography color="text.secondary">
                You have not placed any orders yet.
              </Typography>

              <Button component={Link} to="/products" variant="contained">
                Browse products
              </Button>
            </Stack>
          )}

          {!isLoading && !error && recentOrders.length > 0 && (
            <Stack spacing={2}>
              {recentOrders.map((order, index) => (
                <Box key={order.id}>
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
                    <Stack spacing={1}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          overflowWrap: "anywhere",
                        }}
                      >
                        Order {order.id}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {formatOrderDate(order.createdAt)}
                        </Typography>

                        <Chip
                          label={getStatusLabel(order.status)}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </Stack>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(order.total)}
                      </Typography>

                      <Button
                        component={Link}
                        to={`/account/orders/${order.id}`}
                        size="small"
                      >
                        View
                      </Button>
                    </Stack>
                  </Stack>

                  {index < recentOrders.length - 1 && (
                    <Divider
                      sx={{
                        mt: 2,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
