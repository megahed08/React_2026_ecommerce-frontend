import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max: number;
  disabled?: boolean;
  onChange: (quantity: number) => void;
}

export function QuantitySelector({
  value,
  min = 1,
  max,
  disabled = false,
  onChange,
}: QuantitySelectorProps) {
  function decreaseQuantity() {
    onChange(Math.max(min, value - 1));
  }

  function increaseQuantity() {
    onChange(Math.min(max, value + 1));
  }

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        alignItems: "center",
      }}
    >
      <IconButton
        size="small"
        aria-label="Decrease quantity"
        disabled={disabled || value <= min}
        onClick={decreaseQuantity}
      >
        <RemoveRoundedIcon fontSize="small" />
      </IconButton>

      <Typography
        component="span"
        sx={{
          minWidth: 24,
          textAlign: "center",
        }}
      >
        {value}
      </Typography>

      <IconButton
        size="small"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={increaseQuantity}
      >
        <AddRoundedIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
