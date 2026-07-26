import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";

import { NavLink } from "react-router";

import { AccountMenuButton } from "../../account/AccountMenuButton";
import { CartPreviewButton } from "../../cart/CartPreviewButton";
import { ColorModeButton } from "../../ui/ColorModeButton";
import { SiteBrand } from "../branding/SiteBrand";

const navigationIconStyles = {
  color: "text.secondary",

  "&:hover": {
    color: "primary.main",
    bgcolor: "action.hover",
  },

  '&[aria-current="page"]': {
    color: "primary.main",
    bgcolor: "action.selected",
  },
};

export function MainHeader() {
  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: {
              xs: 64,
              sm: 72,
            },

            gap: {
              xs: 0.5,
              sm: 2,
            },
          }}
        >
          <SiteBrand />

          <Box
            component="nav"
            aria-label="Main navigation"
            sx={{
              ml: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: {
                xs: 0,
                sm: 0.5,
              },
              flexShrink: 0,
            }}
          >
            <Tooltip title="Products">
              <IconButton
                component={NavLink}
                to="/products"
                aria-label="Products"
                sx={navigationIconStyles}
              >
                <StorefrontRoundedIcon />
              </IconButton>
            </Tooltip>

            <CartPreviewButton />

            <AccountMenuButton />

            <ColorModeButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
