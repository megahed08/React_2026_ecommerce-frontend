import { useMemo, useState } from "react";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Link } from "react-router";

import { AdminProductForm } from "../../components/admin/AdminProductForm";
import { AdminProductTable } from "../../components/admin/AdminProductTable";
import { useAdminProducts } from "../../hooks/admin/useAdminProducts";
import { useNotification } from "../../hooks/notifications/useNotification";

import type { CreateProductRequest, Product } from "../../types/product";

export function AdminDashboardPage() {
  const {
    products,
    isLoading,
    isSaving,
    deletingProductId,
    isResetting,
    error,
    reload,
    createProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
  } = useAdminProducts();

  const { showSuccess, showInfo } = useNotification();

  const [searchValue, setSearchValue] = useState("");

  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [productFormVersion, setProductFormVersion] = useState(0);

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        String(product.id).includes(normalizedSearch),
    );
  }, [products, searchValue]);

  const categoryCount = useMemo(
    () => new Set(products.map((product) => product.category)).size,
    [products],
  );

  const lowStockCount = useMemo(
    () =>
      products.filter((product) => product.stock > 0 && product.stock <= 5)
        .length,
    [products],
  );

  const outOfStockCount = useMemo(
    () => products.filter((product) => product.stock === 0).length,
    [products],
  );

  function openCreateProductForm(): void {
    setSelectedProduct(null);

    setProductFormVersion((currentVersion) => currentVersion + 1);

    setIsProductFormOpen(true);
  }

  function openEditProductForm(product: Product): void {
    setSelectedProduct(product);

    setProductFormVersion((currentVersion) => currentVersion + 1);

    setIsProductFormOpen(true);
  }

  function closeProductForm(): void {
    if (isSaving) {
      return;
    }

    setIsProductFormOpen(false);
    setSelectedProduct(null);
  }

  async function handleProductSubmit(
    request: CreateProductRequest,
  ): Promise<void> {
    if (selectedProduct) {
      const updatedProduct = await updateProduct(selectedProduct.id, request);

      if (!updatedProduct) {
        return;
      }

      showSuccess(`${updatedProduct.name} was updated.`);
    } else {
      const createdProduct = await createProduct(request);

      if (!createdProduct) {
        return;
      }

      showSuccess(`${createdProduct.name} was created.`);
    }

    setIsProductFormOpen(false);
    setSelectedProduct(null);

    setProductFormVersion((currentVersion) => currentVersion + 1);
  }

  async function handleDeleteProduct(): Promise<void> {
    if (!productToDelete) {
      return;
    }

    const deletedProduct = productToDelete;

    const wasDeleted = await deleteProduct(deletedProduct.id);

    if (!wasDeleted) {
      return;
    }

    showSuccess(`${deletedProduct.name} was deleted.`);

    setProductToDelete(null);

    if (selectedProduct?.id === deletedProduct.id) {
      setSelectedProduct(null);
      setIsProductFormOpen(false);
    }
  }

  async function handleResetProducts(): Promise<void> {
    const wasReset = await resetProducts();

    if (!wasReset) {
      return;
    }

    setIsResetDialogOpen(false);
    setSelectedProduct(null);
    setIsProductFormOpen(false);
    setSearchValue("");

    showInfo("The original mock product catalog was restored.");
  }

  return (
    <>
      <Stack spacing={3}>
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
          sx={{
            justifyContent: "space-between",

            alignItems: {
              xs: "stretch",
              md: "center",
            },
          }}
        >
          <Box>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 800,
              }}
            >
              Product management
            </Typography>

            <Typography color="text.secondary">
              Add, edit, remove, and restore storefront products.
            </Typography>
          </Box>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
          >
            <Button
              component={Link}
              to="/products"
              variant="outlined"
              startIcon={<StorefrontRoundedIcon />}
            >
              View storefront
            </Button>

            <Button
              type="button"
              variant="outlined"
              startIcon={
                isResetting ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <RestartAltRoundedIcon />
                )
              }
              disabled={isResetting || isSaving || deletingProductId !== null}
              onClick={() => {
                setIsResetDialogOpen(true);
              }}
            >
              Restore catalog
            </Button>

            <Button
              type="button"
              variant="contained"
              startIcon={<AddRoundedIcon />}
              disabled={isSaving || isResetting}
              onClick={openCreateProductForm}
            >
              Add product
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },

            gap: 2,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              <Inventory2RoundedIcon color="primary" />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Products
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {products.length}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              <CategoryRoundedIcon color="primary" />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Categories
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {categoryCount}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              <WarningAmberRoundedIcon color="warning" />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Low stock
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {lowStockCount}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              <WarningAmberRoundedIcon color="error" />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Out of stock
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {outOfStockCount}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

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

        <TextField
          label="Search products"
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
          }}
          placeholder="Search by ID, name, or category"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            },
          }}
        />

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
          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Catalog products
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Showing {filteredProducts.length} of {products.length}
          </Typography>
        </Stack>

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <AdminProductTable
            products={filteredProducts}
            deletingProductId={deletingProductId}
            onEdit={openEditProductForm}
            onDelete={setProductToDelete}
          />
        )}
      </Stack>

      <Dialog
        open={isProductFormOpen}
        fullWidth
        maxWidth="md"
        onClose={closeProductForm}
      >
        <DialogContent
          sx={{
            p: 0,
          }}
        >
          <AdminProductForm
            key={`${selectedProduct?.id ?? "new"}-${productFormVersion}`}
            product={selectedProduct}
            isSaving={isSaving}
            onSubmit={handleProductSubmit}
            onCancel={closeProductForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={productToDelete !== null}
        onClose={() => {
          if (deletingProductId === null) {
            setProductToDelete(null);
          }
        }}
      >
        <DialogTitle>Delete product?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            {productToDelete
              ? `${productToDelete.name} will be removed from the storefront. Existing saved carts will remove it the next time they load.`
              : ""}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            type="button"
            disabled={deletingProductId !== null}
            onClick={() => {
              setProductToDelete(null);
            }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            color="error"
            variant="contained"
            disabled={deletingProductId !== null}
            onClick={() => {
              void handleDeleteProduct();
            }}
          >
            {deletingProductId !== null ? "Deleting..." : "Delete product"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isResetDialogOpen}
        onClose={() => {
          if (!isResetting) {
            setIsResetDialogOpen(false);
          }
        }}
      >
        <DialogTitle>Restore the original catalog?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            All product additions and edits stored in this browser will be
            replaced with the original mock product catalog.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            type="button"
            disabled={isResetting}
            onClick={() => {
              setIsResetDialogOpen(false);
            }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="contained"
            disabled={isResetting}
            startIcon={
              isResetting ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <RestartAltRoundedIcon />
              )
            }
            onClick={() => {
              void handleResetProducts();
            }}
          >
            {isResetting ? "Restoring..." : "Restore catalog"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
