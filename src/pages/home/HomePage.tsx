import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Link } from "react-router";

import { ProductCard } from "../../components/products/ProductCard";
import { useCart } from "../../hooks/cart/useCart";
import { useProducts } from "../../hooks/products/useProducts";

import type { Product } from "../../types/product";

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const BENEFITS: Benefit[] = [
  {
    title: "Fast delivery",
    description: "Reliable delivery options for your everyday shopping.",
    icon: <LocalShippingRoundedIcon fontSize="large" />,
  },
  {
    title: "Secure checkout",
    description:
      "A clear and protected checkout experience from cart to order.",
    icon: <VerifiedUserRoundedIcon fontSize="large" />,
  },
  {
    title: "Customer support",
    description: "Helpful support whenever you need assistance with an order.",
    icon: <SupportAgentRoundedIcon fontSize="large" />,
  },
];

export function HomePage() {
  const { products, categories, isLoading, error } = useProducts();

  const { addItem, isUpdating: isCartUpdating } = useCart();

  const featuredProducts = products.slice(0, 4);

  async function handleAddToCart(
    product: Product,
    quantity: number,
  ): Promise<void> {
    await addItem(product.id, quantity);
  }

  return (
    <Box>
      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 3,
            md: 5,
          },
        }}
      >
        <Stack
          spacing={{
            xs: 6,
            md: 8,
          }}
        >
          <Paper
            component="section"
            elevation={0}
            sx={{
              position: "relative",
              overflow: "hidden",

              px: {
                xs: 3,
                sm: 5,
                md: 8,
              },

              py: {
                xs: 6,
                md: 9,
              },

              color: "primary.contrastText",

              background: (theme) =>
                `linear-gradient(
                  135deg,
                  ${theme.palette.primary.main} 0%,
                  ${theme.palette.primary.dark} 100%
                )`,

              borderRadius: {
                xs: 3,
                md: 5,
              },
            }}
          >
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                width: 280,
                height: 280,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.10)",
                top: -120,
                right: -70,
              }}
            />

            <Box
              aria-hidden
              sx={{
                position: "absolute",
                width: 180,
                height: 180,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                bottom: -90,
                right: 180,
              }}
            />

            <Stack
              spacing={3}
              sx={{
                position: "relative",
                maxWidth: 680,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                }}
              >
                <StorefrontRoundedIcon />

                <Typography
                  variant="overline"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 1.5,
                  }}
                >
                  Welcome to Shop
                </Typography>
              </Stack>

              <Typography
                component="h1"
                variant="h2"
                sx={{
                  fontSize: {
                    xs: "2.4rem",
                    sm: "3.2rem",
                    md: "4rem",
                  },
                  fontWeight: 800,
                  lineHeight: 1.05,
                }}
              >
                Everything you need, all in one place.
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  maxWidth: 600,
                  fontWeight: 400,
                  opacity: 0.9,
                }}
              >
                Explore our product catalog, compare your options, and build
                your cart with a simple shopping experience.
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
                sx={{
                  alignItems: {
                    xs: "stretch",
                    sm: "center",
                  },
                }}
              >
                <Button
                  component={Link}
                  to="/products"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    backgroundColor: "common.white",
                    color: "primary.dark",

                    "&:hover": {
                      backgroundColor: "grey.100",
                    },
                  }}
                >
                  Browse products
                </Button>

                <Button
                  component={Link}
                  to="/cart"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: "inherit",
                    borderColor: "rgba(255, 255, 255, 0.7)",

                    "&:hover": {
                      borderColor: "common.white",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                >
                  View cart
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Box component="section">
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography
                component="h2"
                variant="h4"
                sx={{
                  fontWeight: 700,
                }}
              >
                Shop by category
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  maxWidth: 600,
                }}
              >
                Explore the different product categories currently available in
                the catalog.
              </Typography>

              {categories.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  {categories.slice(0, 8).map((category) => (
                    <Button
                      key={category}
                      component={Link}
                      to="/products"
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: 999,
                        textTransform: "none",
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </Box>
              )}
            </Stack>
          </Box>

          <Box component="section">
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
                    sm: "flex-end",
                  },
                }}
              >
                <Box>
                  <Typography
                    component="h2"
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Featured products
                  </Typography>

                  <Typography color="text.secondary">
                    A selection of products from the current catalog.
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  to="/products"
                  endIcon={<ArrowForwardRoundedIcon />}
                >
                  View all products
                </Button>
              </Stack>

              {error && <Alert severity="error">{error}</Alert>}

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

              {!isLoading && !error && featuredProducts.length === 0 && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 4,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                    }}
                  >
                    No featured products
                  </Typography>

                  <Typography color="text.secondary">
                    Products will appear here when they are available.
                  </Typography>
                </Paper>
              )}

              {!isLoading && !error && featuredProducts.length > 0 && (
                <Box
                  sx={{
                    display: "grid",

                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      lg: "repeat(4, minmax(0, 1fr))",
                    },

                    gap: 3,
                  }}
                >
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isCartUpdating={isCartUpdating}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </Box>
              )}
            </Stack>
          </Box>

          <Box component="section">
            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, minmax(0, 1fr))",
                },

                gap: 3,
              }}
            >
              {BENEFITS.map((benefit) => (
                <Paper
                  key={benefit.title}
                  variant="outlined"
                  sx={{
                    p: 3,
                    height: "100%",
                  }}
                >
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        color: "primary.main",
                        backgroundColor: "action.hover",
                      }}
                    >
                      {benefit.icon}
                    </Box>

                    <Typography
                      component="h3"
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {benefit.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
