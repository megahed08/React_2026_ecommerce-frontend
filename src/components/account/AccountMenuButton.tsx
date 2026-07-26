import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import type { MouseEvent } from "react";

import { NavLink, useLocation, useNavigate } from "react-router";

import { useAuth } from "../../hooks/auth/useAuth";
import { useHoverPopover } from "../../hooks/common/useHoverPopover";

export function AccountMenuButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDesktopPointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const {
    anchorElement,
    isOpen: isPopoverOpen,
    openPopover,
    closePopover,
    scheduleClose,
    clearCloseTimer,
  } = useHoverPopover();

  const isAccountRoute =
    location.pathname === "/account" ||
    location.pathname.startsWith("/account/") ||
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  function handleTriggerClick(event: MouseEvent<HTMLButtonElement>): void {
    clearCloseTimer();

    /*
     * Desktop:
     * clicking always opens the account page.
     */
    if (isDesktopPointer) {
      closePopover();
      navigate("/account");

      return;
    }

    /*
     * Touch/mobile:
     * first tap opens the menu.
     */
    if (!isPopoverOpen) {
      openPopover(event.currentTarget);

      return;
    }

    /*
     * Touch/mobile:
     * second tap opens account overview.
     */
    closePopover();
    navigate("/account");
  }

  async function handleLogout(): Promise<void> {
    closePopover();

    await logout();

    navigate("/", {
      replace: true,
    });
  }

  if (!isAuthenticated) {
    return (
      <Tooltip title="Log in">
        <IconButton
          component={NavLink}
          to="/login"
          aria-label="Log in"
          disabled={isLoading}
          sx={{
            color:
              location.pathname === "/login"
                ? "primary.main"
                : "text.secondary",

            bgcolor:
              location.pathname === "/login" ? "action.selected" : undefined,

            "&:hover": {
              color: "primary.main",
              bgcolor: "action.hover",
            },
          }}
        >
          <LoginRoundedIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <>
      <IconButton
        type="button"
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-controls={isPopoverOpen ? "account-popover" : undefined}
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
            isPopoverOpen || isAccountRoute ? "primary.main" : "text.secondary",

          bgcolor:
            isPopoverOpen || isAccountRoute ? "action.selected" : undefined,

          "&:hover": {
            color: "primary.main",
            bgcolor: "action.hover",
          },
        }}
      >
        <AccountCircleRoundedIcon />
      </IconButton>

      <Popover
        id="account-popover"
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
                sm: 280,
              },

              maxWidth: 320,

              maxHeight: "calc(100dvh - 88px)",

              mt: 1,
              overflowY: "auto",
              pointerEvents: "auto",
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",

              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                minWidth: 0,
                fontWeight: 600,
                overflowWrap: "anywhere",
              }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>

            {user?.role === "admin" && (
              <Chip label="Admin" color="primary" size="small" />
            )}
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflowWrap: "anywhere",
            }}
          >
            {user?.email}
          </Typography>
        </Box>

        <Divider />

        <MenuList disablePadding>
          <MenuItem
            type="button"
            onClick={() => {
              closePopover();
              navigate("/account");
            }}
          >
            <ListItemIcon>
              <DashboardRoundedIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="Overview" />
          </MenuItem>

          <MenuItem
            type="button"
            onClick={() => {
              closePopover();
              navigate("/account/profile");
            }}
          >
            <ListItemIcon>
              <ManageAccountsRoundedIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="Profile" />
          </MenuItem>

          <MenuItem
            type="button"
            onClick={() => {
              closePopover();
              navigate("/account/orders");
            }}
          >
            <ListItemIcon>
              <ReceiptLongRoundedIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="Orders" />
          </MenuItem>

          {user?.role === "admin" && (
            <>
              <Divider />

              <MenuItem
                type="button"
                onClick={() => {
                  closePopover();
                  navigate("/admin");
                }}
              >
                <ListItemIcon>
                  <AdminPanelSettingsRoundedIcon fontSize="small" />
                </ListItemIcon>

                <ListItemText primary="Admin dashboard" />
              </MenuItem>
            </>
          )}

          <Divider />

          <MenuItem
            disabled={isLoading}
            onClick={() => {
              void handleLogout();
            }}
            sx={{
              color: "error.main",
            }}
          >
            <ListItemIcon
              sx={{
                color: "inherit",
              }}
            >
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="Log out" />
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
