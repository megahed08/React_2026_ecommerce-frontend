import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Link, useParams } from "react-router";

import { OrderDetailsCard } from "../../components/orders/OrderDetailsCard";
import { useOrder } from "../../hooks/orders/useOrder";

export function OrderDetailsPage() {
  const { orderId } = useParams<{
    orderId: string;
  }>();

  const { order, isLoading, error, reload } = useOrder(orderId);

  return (
    <Stack
      spacing={3}
      sx={{
        maxWidth: 900,
        mx: "auto",
      }}
    >
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
            Order details
          </Typography>

          <Typography color="text.secondary">
            View your order products, payment, delivery address, and current
            status.
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/account/orders"
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
        >
          Back to orders
        </Button>
      </Stack>

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
              Return to order history
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
                component="h2"
                variant="h5"
                sx={{
                  fontWeight: 700,
                }}
              >
                Order not found
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                }}
              >
                The requested order does not exist, is unavailable, or does not
                belong to this account.
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
                startIcon={<ArrowBackRoundedIcon />}
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
          <OrderDetailsCard order={order} />

          <Box>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              startIcon={<StorefrontRoundedIcon />}
            >
              Continue shopping
            </Button>
          </Box>
        </>
      )}
    </Stack>
  );
}
