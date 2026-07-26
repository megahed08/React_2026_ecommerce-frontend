import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ProductFilters } from "../../components/products/ProductFilters";
import { ProductGrid } from "../../components/products/ProductGrid";
import { ProductPagination } from "../../components/products/ProductPagination";
import { useCart } from "../../hooks/cart/useCart";
import { useProducts } from "../../hooks/products/useProducts";

import type { Product } from "../../types/product";

export function ProductsPage() {
  const {
    query,
    products,
    categories,
    totalItems,
    totalPages,
    isLoading,
    error,
    setSearch,
    setCategory,
    setSortBy,
    setSortDirection,
    setPage,
    setPageSize,
  } = useProducts();

  const { addItem, isUpdating, error: cartError } = useCart();

  const hasActiveFilters =
    query.search.trim().length > 0 || query.category !== "all";

  async function handleAddToCart(
    product: Product,
    quantity: number,
  ): Promise<void> {
    await addItem(product.id, quantity);
  }

  function handleClearFilters(): void {
    setSearch("");
    setCategory("all");
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
          Products
        </Typography>

        <Typography color="text.secondary">
          Browse our current product collection.
        </Typography>
      </Box>

      <ProductFilters
        searchTerm={query.search}
        category={query.category}
        sortBy={query.sortBy}
        sortDirection={query.sortDirection}
        categories={categories}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      {cartError && <Alert severity="error">{cartError}</Alert>}

      {!isLoading && !error && (
        <Typography variant="body2" color="text.secondary">
          {totalItems} {totalItems === 1 ? "product" : "products"} found
        </Typography>
      )}

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

      {!isLoading && error && <Alert severity="error">{error}</Alert>}

      {!isLoading && !error && products.length === 0 && (
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
            <SearchOffRoundedIcon
              color="disabled"
              sx={{
                fontSize: 64,
              }}
            />

            <Box>
              <Typography
                component="h2"
                variant="h5"
                sx={{
                  fontWeight: 700,
                }}
              >
                {hasActiveFilters
                  ? "No matching products"
                  : "No products available"}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                }}
              >
                {hasActiveFilters
                  ? "Try changing your search term or selected category."
                  : "Products will appear here when they become available."}
              </Typography>
            </Box>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="outlined"
                onClick={handleClearFilters}
              >
                Clear filters
              </Button>
            )}
          </Stack>
        </Paper>
      )}

      {!isLoading && !error && products.length > 0 && (
        <>
          <ProductGrid
            products={products}
            isCartUpdating={isUpdating}
            onAddToCart={handleAddToCart}
          />

          <ProductPagination
            page={query.page}
            pageSize={query.pageSize}
            totalPages={totalPages}
            disabled={isLoading}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </Stack>
  );
}
