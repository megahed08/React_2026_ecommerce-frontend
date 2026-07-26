import { useState } from "react";

import type { SubmitEvent } from "react";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { CreateProductRequest, Product } from "../../types/product";

interface AdminProductFormProps {
  product?: Product | null;
  isSaving?: boolean;

  onSubmit: (request: CreateProductRequest) => void | Promise<void>;

  onCancel?: () => void;
}

interface ProductFormValues {
  name: string;
  category: string;
  price: string;
  rating: string;
  stock: string;
  image: string;
  description: string;
}

type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

interface ValidationResult {
  request: CreateProductRequest | null;
  errors: ProductFormErrors;
}

function createInitialValues(
  product: Product | null | undefined,
): ProductFormValues {
  if (product) {
    return {
      name: product.name,
      category: product.category,
      price: String(product.price),
      rating: String(product.rating),
      stock: String(product.stock),
      image: product.image,
      description: product.description,
    };
  }

  return {
    name: "",
    category: "",
    price: "",
    rating: "0",
    stock: "0",
    image: "",
    description: "",
  };
}

function validateForm(values: ProductFormValues): ValidationResult {
  const errors: ProductFormErrors = {};

  const name = values.name.trim();
  const category = values.category.trim();
  const image = values.image.trim();
  const description = values.description.trim();

  const price = Number(values.price);
  const rating = Number(values.rating);
  const stock = Number(values.stock);

  if (!name) {
    errors.name = "Product name is required.";
  }

  if (!category) {
    errors.category = "Category is required.";
  }

  if (!values.price.trim()) {
    errors.price = "Price is required.";
  } else if (!Number.isFinite(price) || price < 0) {
    errors.price = "Price must be zero or greater.";
  }

  if (!values.rating.trim()) {
    errors.rating = "Rating is required.";
  } else if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    errors.rating = "Rating must be between 0 and 5.";
  }

  if (!values.stock.trim()) {
    errors.stock = "Stock is required.";
  } else if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock must be a whole number of zero or greater.";
  }

  if (!image) {
    errors.image = "Product image URL is required.";
  }

  if (!description) {
    errors.description = "Product description is required.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      request: null,
      errors,
    };
  }

  return {
    request: {
      name,
      category,
      price,
      rating,
      stock,
      image,
      description,
    },
    errors: {},
  };
}

export function AdminProductForm({
  product = null,
  isSaving = false,
  onSubmit,
  onCancel,
}: AdminProductFormProps) {
  const isEditing = product !== null;

  const [values, setValues] = useState<ProductFormValues>(() =>
    createInitialValues(product),
  );

  const [errors, setErrors] = useState<ProductFormErrors>({});

  function updateField(field: keyof ProductFormValues, value: string): void {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const updatedErrors = {
        ...currentErrors,
      };

      delete updatedErrors[field];

      return updatedErrors;
    });
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const validationResult = validateForm(values);

    setErrors(validationResult.errors);

    if (!validationResult.request) {
      return;
    }

    await onSubmit(validationResult.request);
  }

  return (
    <Paper
      component="form"
      variant="outlined"
      noValidate
      onSubmit={handleSubmit}
      sx={{
        p: {
          xs: 2,
          sm: 3,
        },
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography
            component="h2"
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            {isEditing ? "Edit product" : "Add product"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {isEditing
              ? `Update product #${product.id}.`
              : "Create a new product for the storefront catalog."}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },

            gap: 2,
          }}
        >
          <TextField
            label="Product name"
            name="name"
            value={values.name}
            onChange={(event) => {
              updateField("name", event.target.value);
            }}
            required
            fullWidth
            disabled={isSaving}
            error={errors.name !== undefined}
            helperText={errors.name}
          />

          <TextField
            label="Category"
            name="category"
            value={values.category}
            onChange={(event) => {
              updateField("category", event.target.value);
            }}
            required
            fullWidth
            disabled={isSaving}
            error={errors.category !== undefined}
            helperText={
              errors.category ??
              "For example: Electronics, Home, or Accessories."
            }
          />
        </Box>

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, minmax(0, 1fr))",
            },

            gap: 2,
          }}
        >
          <TextField
            label="Price"
            name="price"
            type="number"
            value={values.price}
            onChange={(event) => {
              updateField("price", event.target.value);
            }}
            required
            fullWidth
            disabled={isSaving}
            error={errors.price !== undefined}
            helperText={errors.price ?? "Example: 49.99"}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 0.01,
              },
            }}
          />

          <TextField
            label="Rating"
            name="rating"
            type="number"
            value={values.rating}
            onChange={(event) => {
              updateField("rating", event.target.value);
            }}
            required
            fullWidth
            disabled={isSaving}
            error={errors.rating !== undefined}
            helperText={errors.rating ?? "From 0 to 5."}
            slotProps={{
              htmlInput: {
                min: 0,
                max: 5,
                step: 0.1,
              },
            }}
          />

          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={values.stock}
            onChange={(event) => {
              updateField("stock", event.target.value);
            }}
            required
            fullWidth
            disabled={isSaving}
            error={errors.stock !== undefined}
            helperText={errors.stock ?? "Whole units available."}
            slotProps={{
              htmlInput: {
                min: 0,
                step: 1,
              },
            }}
          />
        </Box>

        <TextField
          label="Image URL"
          name="image"
          type="url"
          value={values.image}
          onChange={(event) => {
            updateField("image", event.target.value);
          }}
          required
          fullWidth
          disabled={isSaving}
          error={errors.image !== undefined}
          helperText={
            errors.image ?? "Use an HTTPS image URL or a public asset path."
          }
        />

        <TextField
          label="Description"
          name="description"
          value={values.description}
          onChange={(event) => {
            updateField("description", event.target.value);
          }}
          required
          fullWidth
          multiline
          minRows={4}
          disabled={isSaving}
          error={errors.description !== undefined}
          helperText={errors.description}
        />

        <Stack
          direction={{
            xs: "column-reverse",
            sm: "row",
          }}
          spacing={1}
          sx={{
            justifyContent: "flex-end",
          }}
        >
          {onCancel && (
            <Button
              type="button"
              variant="text"
              disabled={isSaving}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
            startIcon={
              isSaving ? (
                <CircularProgress size={18} color="inherit" />
              ) : isEditing ? (
                <SaveRoundedIcon />
              ) : (
                <AddRoundedIcon />
              )
            }
          >
            {isSaving
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Create product"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
