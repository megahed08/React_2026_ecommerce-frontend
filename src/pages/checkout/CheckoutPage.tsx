import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Link, useNavigate } from "react-router";

import { CheckoutForm } from "../../components/checkout/CheckoutForm";
import { CheckoutSummary } from "../../components/checkout/CheckoutSummary";
import { useAuth } from "../../hooks/auth/useAuth";
import { useCart } from "../../hooks/cart/useCart";
import { useCheckout } from "../../hooks/checkout/useCheckout";

import type {
  CheckoutFormValues,
  CreateOrderRequest,
} from "../../types/checkout";

import { markOrderAsRecentlyPlaced } from "../../utils/orders/order-confirmation";

export function CheckoutPage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    cart,
    isLoading: isCartLoading,
    isUpdating: isCartUpdating,
    error: cartError,
    reloadCart,
    clearCart,
  } = useCart();

  const { isSubmitting, error: checkoutError, createOrder } = useCheckout();

  const isBusy = isSubmitting || isCartUpdating;

  async function handleSubmit(values: CheckoutFormValues): Promise<void> {
    if (isBusy || cart.items.length === 0) {
      return;
    }

    const request: CreateOrderRequest = {
      items: cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),

      shippingAddress: values.shippingAddress,

      paymentMethod: values.paymentMethod,
    };

    const createdOrder = await createOrder(request);

    if (!createdOrder) {
      return;
    }

    await clearCart();

    markOrderAsRecentlyPlaced(createdOrder.id);

    navigate(`/orders/${createdOrder.id}/confirmation`, {
      replace: true,
    });
  }

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
          Checkout
        </Typography>

        <Typography color="text.secondary">
          Review your information and complete your order.
        </Typography>
      </Box>

      {isCartLoading && (
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

      {!isCartLoading && cartError && cart.items.length === 0 && (
        <Stack spacing={2}>
          <Alert severity="error">{cartError}</Alert>

          <Box>
            <Button
              type="button"
              variant="outlined"
              onClick={() => {
                void reloadCart();
              }}
            >
              Try again
            </Button>
          </Box>
        </Stack>
      )}

      {!isCartLoading && !cartError && cart.items.length === 0 && (
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
            <ShoppingCartOutlinedIcon
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
              Your cart is empty
            </Typography>

            <Typography color="text.secondary">
              Add products to your cart before starting checkout.
            </Typography>

            <Button component={Link} to="/products" variant="contained">
              Browse products
            </Button>
          </Stack>
        </Paper>
      )}

      {!isCartLoading && cart.items.length > 0 && (
        <>
          {checkoutError && <Alert severity="error">{checkoutError}</Alert>}

          {cartError && <Alert severity="error">{cartError}</Alert>}

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 2fr) minmax(320px, 1fr)",
              },

              gap: 3,
              alignItems: "start",
            }}
          >
            <CheckoutForm
              isSubmitting={isBusy}
              initialShippingAddress={
                user
                  ? {
                      firstName: user.firstName,

                      lastName: user.lastName,

                      email: user.email,
                    }
                  : undefined
              }
              onSubmit={handleSubmit}
            />

            <CheckoutSummary cart={cart} />
          </Box>
        </>
      )}
    </Stack>
  );
}
