import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Link, useParams } from "react-router";

import { ProductDetails } from "../../components/products/ProductDetails";
import { useCart } from "../../hooks/cart/useCart";
import { useProduct } from "../../hooks/products/useProduct";

import type { Product } from "../../types/product";

export function ProductDetailsPage() {
  const { id } = useParams<{
    id: string;
  }>();

  const parsedProductId = Number(id);

  const isValidProductId =
    Number.isInteger(parsedProductId) && parsedProductId > 0;

  const productId = isValidProductId ? parsedProductId : null;

  const { product, isLoading, error, isNotFound } = useProduct(productId);

  const { addItem, isUpdating, error: cartError } = useCart();

  async function handleAddToCart(
    selectedProduct: Product,
    quantity: number,
  ): Promise<void> {
    await addItem(selectedProduct.id, quantity);
  }

  if (!isValidProductId) {
    return <ProductNotFoundState message="The product address is invalid." />;
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Stack spacing={2}>
        <Alert severity="error">{error}</Alert>

        <Box>
          <Button
            component={Link}
            to="/products"
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
          >
            Back to products
          </Button>
        </Box>
      </Stack>
    );
  }

  if (isNotFound || !product) {
    return (
      <ProductNotFoundState message="The requested product does not exist or may no longer be available." />
    );
  }

  return (
    <Stack spacing={2}>
      {cartError && <Alert severity="error">{cartError}</Alert>}

      <ProductDetails
        product={product}
        isCartUpdating={isUpdating}
        onAddToCart={handleAddToCart}
      />
    </Stack>
  );
}

interface ProductNotFoundStateProps {
  message: string;
}

function ProductNotFoundState({ message }: ProductNotFoundStateProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        maxWidth: 720,
        mx: "auto",
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
          <SearchOffRoundedIcon
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
            Product not found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            {message}
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
            to="/products"
            variant="contained"
            startIcon={<ArrowBackRoundedIcon />}
          >
            Browse products
          </Button>

          <Button
            component={Link}
            to="/"
            variant="outlined"
            startIcon={<HomeRoundedIcon />}
          >
            Go to home
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
