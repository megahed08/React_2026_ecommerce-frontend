import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";

import { Link } from "react-router";

import { SiteBrand } from "../branding/SiteBrand";

export function CheckoutHeader() {
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

            justifyContent: "space-between",

            gap: 2,
          }}
        >
          <SiteBrand />

          <Button
            component={Link}
            to="/cart"
            color="inherit"
            aria-label="Back to cart"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              flexShrink: 0,

              minWidth: {
                xs: 40,
                sm: "auto",
              },

              px: {
                xs: 1,
                sm: 2,
              },

              "& .MuiButton-startIcon": {
                mr: {
                  xs: 0,
                  sm: 1,
                },

                ml: {
                  xs: 0,
                  sm: -0.5,
                },
              },
            }}
          >
            <Box
              component="span"
              sx={{
                display: {
                  xs: "none",
                  sm: "inline",
                },
              }}
            >
              Back to cart
            </Box>
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
