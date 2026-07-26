import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

interface ProductPaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 15, 30, 60];

export function ProductPagination({
  page,
  pageSize,
  totalPages,
  disabled = false,
  onPageChange,
  onPageSizeChange,
}: ProductPaginationProps) {
  function handlePageSizeChange(event: SelectChangeEvent) {
    onPageSizeChange(Number(event.target.value));
  }

  return (
    <Box
      component="nav"
      aria-label="Product pagination"
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        alignItems: {
          xs: "stretch",
          sm: "center",
        },
        justifyContent: "space-between",
        gap: 2,
        pt: 2,
      }}
    >
      <FormControl
        size="small"
        disabled={disabled}
        sx={{
          minWidth: 150,
        }}
      >
        <InputLabel id="product-page-size-label">Products per page</InputLabel>

        <Select
          id="product-page-size"
          labelId="product-page-size-label"
          value={String(pageSize)}
          label="Products per page"
          onChange={handlePageSizeChange}
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <MenuItem key={option} value={String(option)}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(_, selectedPage) => {
            onPageChange(selectedPage - 1);
          }}
          disabled={disabled}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      )}
    </Box>
  );
}
