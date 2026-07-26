import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Link } from "react-router";

import { CartItem } from "../../components/cart/CartItem";
import { CartSummary } from "../../components/cart/CartSummary";
import { useCart } from "../../hooks/cart/useCart";

export function CartPage() {
  const {
    cart,
    isLoading,
    isUpdating,
    error,
    reloadCart,
    updateItem,
    removeItem,
  } = useCart();

  async function handleQuantityChange(
    productId: number,
    quantity: number,
  ): Promise<void> {
    await updateItem(productId, quantity);
  }

  async function handleRemove(productId: number): Promise<void> {
    await removeItem(productId);
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
          Shopping cart
        </Typography>

        <Typography color="text.secondary">
          Review your products before continuing to checkout.
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

      {!isLoading && error && cart.items.length === 0 && (
        <Stack spacing={2}>
          <Alert severity="error">{error}</Alert>

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

      {!isLoading && !error && cart.items.length === 0 && (
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
            <ShoppingBagOutlinedIcon
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
              Browse the catalog and add products to your cart.
            </Typography>

            <Button component={Link} to="/products" variant="contained">
              Browse products
            </Button>
          </Stack>
        </Paper>
      )}

      {!isLoading && cart.items.length > 0 && (
        <>
          {error && <Alert severity="error">{error}</Alert>}

          <Typography variant="body2" color="text.secondary">
            {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}{" "}
            in your cart
          </Typography>

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 2fr) minmax(300px, 1fr)",
              },

              gap: 3,
              alignItems: "start",
            }}
          >
            <Stack spacing={2}>
              {cart.items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  isUpdating={isUpdating}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </Stack>

            <CartSummary cart={cart} isUpdating={isUpdating} />
          </Box>
        </>
      )}
    </Stack>
  );
}
