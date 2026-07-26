import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Link, Navigate, useParams } from "react-router";

import { OrderDetailsCard } from "../../components/orders/OrderDetailsCard";
import { useOrder } from "../../hooks/orders/useOrder";
import { isRecentOrderConfirmation } from "../../utils/orders/order-confirmation";

export function OrderSuccessPage() {
  const { orderId } = useParams<{
    orderId: string;
  }>();

  const { order, isLoading, error, reload } = useOrder(orderId);

  const isRecentConfirmation =
    orderId !== undefined && isRecentOrderConfirmation(orderId);

  /*
   * The confirmation page is temporary.
   *
   * Old bookmarks and direct visits should use
   * the permanent account order-details route.
   */
  if (orderId && !isRecentConfirmation) {
    return <Navigate to={`/account/orders/${orderId}`} replace />;
  }

  return (
    <Stack
      spacing={3}
      sx={{
        maxWidth: 900,
        mx: "auto",
      }}
    >
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

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            sx={{
              alignItems: {
                xs: "stretch",
                sm: "center",
              },
            }}
          >
            <Button type="button" variant="outlined" onClick={reload}>
              Try again
            </Button>

            <Button component={Link} to="/account/orders" variant="text">
              View my orders
            </Button>
          </Stack>
        </Stack>
      )}

      {!isLoading && !error && !order && (
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
            spacing={3}
            sx={{
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                borderRadius: "50%",
                color: "primary.main",
                backgroundColor: "action.hover",
              }}
            >
              <ReceiptLongRoundedIcon
                sx={{
                  fontSize: 44,
                }}
              />
            </Box>

            <Box>
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 700,
                }}
              >
                Confirmation unavailable
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                }}
              >
                The order confirmation could not be loaded. You can still view
                your existing orders from your account.
              </Typography>
            </Box>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
            >
              <Button
                component={Link}
                to="/account/orders"
                variant="contained"
                startIcon={<ReceiptLongRoundedIcon />}
              >
                View my orders
              </Button>

              <Button
                component={Link}
                to="/products"
                variant="outlined"
                startIcon={<StorefrontRoundedIcon />}
              >
                Browse products
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {!isLoading && !error && order && (
        <>
          <Paper
            elevation={0}
            sx={{
              position: "relative",
              overflow: "hidden",
              p: {
                xs: 3,
                sm: 5,
              },
              textAlign: "center",
              borderRadius: 3,
              color: "success.contrastText",
              backgroundColor: "success.main",
            }}
          >
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                width: 180,
                height: 180,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.10)",
                top: -100,
                right: -60,
              }}
            />

            <Stack
              spacing={2}
              sx={{
                position: "relative",
                alignItems: "center",
              }}
            >
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 76,
                }}
              />

              <Box>
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  Your order has been placed
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    opacity: 0.9,
                  }}
                >
                  Thank you for your purchase. Your order has been received
                  successfully.
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  overflowWrap: "anywhere",
                }}
              >
                Order ID: {order.id}
              </Typography>
            </Stack>
          </Paper>

          <OrderDetailsCard order={order} />

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <Button
              component={Link}
              to={`/account/orders/${order.id}`}
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              View permanent order details
            </Button>

            <Button
              component={Link}
              to="/products"
              variant="outlined"
              startIcon={<StorefrontRoundedIcon />}
            >
              Continue shopping
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
}
