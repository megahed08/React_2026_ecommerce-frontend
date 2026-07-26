import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import type {
  ProductSortField,
  SortDirection,
} from "../../types/product-query";

interface ProductFiltersProps {
  searchTerm: string;
  category: string;
  sortBy: ProductSortField;
  sortDirection: SortDirection;
  categories: string[];

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortByChange: (value: ProductSortField) => void;
  onSortDirectionChange: (value: SortDirection) => void;
}

export function ProductFilters({
  searchTerm,
  category,
  sortBy,
  sortDirection,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortByChange,
  onSortDirectionChange,
}: ProductFiltersProps) {
  function handleCategoryChange(event: SelectChangeEvent) {
    onCategoryChange(event.target.value);
  }

  function handleSortByChange(event: SelectChangeEvent) {
    onSortByChange(event.target.value as ProductSortField);
  }

  function handleSortDirectionChange(event: SelectChangeEvent) {
    onSortDirectionChange(event.target.value as SortDirection);
  }

  return (
    <Box
      component="section"
      aria-label="Product filters"
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "minmax(260px, 2fr) repeat(3, minmax(160px, 1fr))",
        },
        gap: 2,
      }}
    >
      <TextField
        id="product-search"
        label="Search products"
        placeholder="Search by name or description"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        size="small"
        fullWidth
      />

      <FormControl size="small" fullWidth>
        <InputLabel id="product-category-label">Category</InputLabel>

        <Select
          id="product-category"
          labelId="product-category-label"
          value={category}
          label="Category"
          onChange={handleCategoryChange}
        >
          <MenuItem value="all">All categories</MenuItem>

          {categories.map((currentCategory) => (
            <MenuItem key={currentCategory} value={currentCategory}>
              {currentCategory}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" fullWidth>
        <InputLabel id="product-sort-by-label">Sort by</InputLabel>

        <Select
          id="product-sort-by"
          labelId="product-sort-by-label"
          value={sortBy}
          label="Sort by"
          onChange={handleSortByChange}
        >
          <MenuItem value="featured">Featured</MenuItem>

          <MenuItem value="price">Price</MenuItem>

          <MenuItem value="rating">Rating</MenuItem>

          <MenuItem value="name">Name</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" fullWidth disabled={sortBy === "featured"}>
        <InputLabel id="product-sort-direction-label">Direction</InputLabel>

        <Select
          id="product-sort-direction"
          labelId="product-sort-direction-label"
          value={sortDirection}
          label="Direction"
          onChange={handleSortDirectionChange}
        >
          <MenuItem value="asc">Ascending</MenuItem>

          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
