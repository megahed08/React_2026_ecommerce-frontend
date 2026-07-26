import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useLocation, useNavigate } from "react-router";

import { useCart } from "../../hooks/cart/useCart";
import { useHoverPopover } from "../../hooks/common/useHoverPopover";
import { formatCurrency } from "../../utils/currency/formatCurrency";

const MAX_PREVIEW_ITEMS = 3;

export function CartPreviewButton() {
  const location = useLocation();
  const navigate = useNavigate();

  const isDesktopPointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  const { cart, isLoading } = useCart();

  const {
    anchorElement,
    isOpen: isPopoverOpen,
    openPopover,
    closePopover,
    scheduleClose,
    clearCloseTimer,
  } = useHoverPopover();

  const previewItems = cart.items.slice(0, MAX_PREVIEW_ITEMS);

  const remainingItems = Math.max(cart.items.length - MAX_PREVIEW_ITEMS, 0);

  const isCartRoute = location.pathname === "/cart";

  function handleTriggerClick(
    event: React.MouseEvent<HTMLButtonElement>,
  ): void {
    clearCloseTimer();

    /*
     * Desktop:
     * clicking always opens the cart page.
     */
    if (isDesktopPointer) {
      closePopover();
      navigate("/cart");

      return;
    }

    /*
     * Touch/mobile:
     * first tap opens the preview.
     */
    if (!isPopoverOpen) {
      openPopover(event.currentTarget);

      return;
    }

    /*
     * Touch/mobile:
     * second tap opens the cart page.
     */
    closePopover();
    navigate("/cart");
  }

  return (
    <>
      <IconButton
        type="button"
        aria-label={`Open cart with ${cart.totalQuantity} ${
          cart.totalQuantity === 1 ? "item" : "items"
        }`}
        aria-haspopup="dialog"
        aria-controls={isPopoverOpen ? "cart-preview-popover" : undefined}
        aria-expanded={isPopoverOpen ? true : undefined}
        disabled={isLoading}
        onMouseEnter={(event) => {
          if (!isDesktopPointer) {
            return;
          }

          openPopover(event.currentTarget);
        }}
        onMouseLeave={() => {
          if (!isDesktopPointer) {
            return;
          }

          scheduleClose();
        }}
        onFocus={(event) => {
          if (!isDesktopPointer) {
            return;
          }

          openPopover(event.currentTarget);
        }}
        onClick={handleTriggerClick}
        sx={{
          color:
            isPopoverOpen || isCartRoute ? "primary.main" : "text.secondary",

          bgcolor: isPopoverOpen || isCartRoute ? "action.selected" : undefined,

          "&:hover": {
            color: "primary.main",
            bgcolor: "action.hover",
          },
        }}
      >
        <Badge
          badgeContent={cart.totalQuantity}
          color="secondary"
          invisible={isLoading || cart.totalQuantity === 0}
          max={99}
        >
          <ShoppingCartRoundedIcon />
        </Badge>
      </IconButton>

      <Popover
        id="cart-preview-popover"
        open={isPopoverOpen}
        anchorEl={anchorElement}
        onClose={closePopover}
        disableRestoreFocus
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={
          isDesktopPointer
            ? {
                pointerEvents: "none",
              }
            : undefined
        }
        slotProps={{
          paper: {
            onMouseEnter: () => {
              if (!isDesktopPointer) {
                return;
              }

              clearCloseTimer();
            },

            onMouseLeave: () => {
              if (!isDesktopPointer) {
                return;
              }

              scheduleClose();
            },

            sx: {
              width: {
                xs: "calc(100vw - 24px)",
                sm: 360,
              },

              maxWidth: 360,

              maxHeight: "calc(100dvh - 88px)",

              mt: 1,
              overflowY: "auto",
              pointerEvents: "auto",
            },
          },
        }}
      >
        <Stack
          spacing={2}
          sx={{
            p: 2,
          }}
        >
          <Box>
            <Typography
              component="h2"
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Shopping cart
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}
            </Typography>
          </Box>

          <Divider />

          {cart.items.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{
                py: 2,
                textAlign: "center",
              }}
            >
              Your cart is empty.
            </Typography>
          ) : (
            <>
              <Stack spacing={2}>
                {previewItems.map((item) => (
                  <Box
                    key={item.product.id}
                    sx={{
                      display: "grid",

                      gridTemplateColumns: "56px minmax(0, 1fr)",

                      gap: 1.5,
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={item.product.image}
                      alt={item.product.name}
                      sx={{
                        width: 56,
                        height: 56,
                        objectFit: "cover",
                        borderRadius: 1,
                        border: 1,
                        borderColor: "divider",
                      }}
                    />

                    <Box
                      sx={{
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          overflow: "hidden",

                          textOverflow: "ellipsis",

                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.product.name}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          justifyContent: "space-between",

                          alignItems: "center",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {formatCurrency(item.lineTotal)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Stack>

              {remainingItems > 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  And {remainingItems} more{" "}
                  {remainingItems === 1 ? "product" : "products"}
                </Typography>
              )}

              <Divider />

              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Subtotal
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                  }}
                >
                  {formatCurrency(cart.subtotal)}
                </Typography>
              </Stack>
            </>
          )}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
          >
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => {
                closePopover();
                navigate("/cart");
              }}
            >
              View cart
            </Button>

            <Button
              type="button"
              variant="contained"
              fullWidth
              disabled={cart.items.length === 0}
              onClick={() => {
                closePopover();
                navigate("/checkout");
              }}
            >
              Checkout
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
}
