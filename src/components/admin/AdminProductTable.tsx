import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import type { Product } from "../../types/product";
import { formatCurrency } from "../../utils/currency/formatCurrency";

interface AdminProductTableProps {
  products: Product[];
  deletingProductId: number | null;

  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

function getStockColor(stock: number): "success" | "warning" | "error" {
  if (stock === 0) {
    return "error";
  }

  if (stock <= 5) {
    return "warning";
  }

  return "success";
}

function getStockLabel(stock: number): string {
  if (stock === 0) {
    return "Out of stock";
  }

  if (stock <= 5) {
    return `${stock} remaining`;
  }

  return `${stock} available`;
}

export function AdminProductTable({
  products,
  deletingProductId,
  onEdit,
  onDelete,
}: AdminProductTableProps) {
  if (products.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: {
            xs: 3,
            sm: 5,
          },
          textAlign: "center",
        }}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <Inventory2OutlinedIcon
            color="disabled"
            sx={{
              fontSize: 64,
            }}
          />

          <Box>
            <Typography
              component="h2"
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              No products found
            </Typography>

            <Typography color="text.secondary">
              Add a product or change the current search filter.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          overflowX: "auto",
        }}
      >
        <Table
          aria-label="Admin products"
          sx={{
            minWidth: 850,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>

              <TableCell>Category</TableCell>

              <TableCell align="right">Price</TableCell>

              <TableCell align="center">Rating</TableCell>

              <TableCell>Stock</TableCell>

              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product) => {
              const isDeleting = deletingProductId === product.id;

              return (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: "center",
                        minWidth: 260,
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{
                          width: 56,
                          height: 56,
                          flexShrink: 0,
                          objectFit: "cover",
                          borderRadius: 1.5,
                          border: 1,
                          borderColor: "divider",
                          backgroundColor: "action.hover",
                        }}
                      />

                      <Box
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {product.name}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Product #{product.id}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>{product.category}</TableCell>

                  <TableCell align="right">
                    {formatCurrency(product.price)}
                  </TableCell>

                  <TableCell align="center">
                    {product.rating.toFixed(1)}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getStockLabel(product.stock)}
                      color={getStockColor(product.stock)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        type="button"
                        size="small"
                        variant="outlined"
                        startIcon={<EditRoundedIcon />}
                        disabled={isDeleting}
                        onClick={() => {
                          onEdit(product);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        type="button"
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={
                          isDeleting ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <DeleteOutlineRoundedIcon />
                          )
                        }
                        disabled={isDeleting}
                        onClick={() => {
                          onDelete(product);
                        }}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
