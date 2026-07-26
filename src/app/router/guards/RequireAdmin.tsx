import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Link, Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "../../../hooks/auth/useAuth";

export function RequireAdmin() {
  const location = useLocation();

  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    const returnTo = [location.pathname, location.search, location.hash].join(
      "",
    );

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: returnTo,
        }}
      />
    );
  }

  if (user?.role !== "admin") {
    return (
      <Paper
        variant="outlined"
        sx={{
          maxWidth: 720,
          mx: "auto",

          p: {
            xs: 3,
            sm: 5,
          },

          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Stack
          spacing={3}
          sx={{
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: "50%",
              color: "warning.main",
              backgroundColor: "action.hover",
            }}
          >
            <AdminPanelSettingsRoundedIcon
              sx={{
                fontSize: 44,
              }}
            />
          </Box>

          <Box>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              Administrator access required
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
              }}
            >
              Your account is signed in, but it does not have permission to
              manage storefront products.
            </Typography>
          </Box>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            <Button
              component={Link}
              to="/account"
              variant="contained"
              startIcon={<ArrowBackRoundedIcon />}
            >
              Return to account
            </Button>

            <Button
              component={Link}
              to="/products"
              variant="outlined"
              startIcon={<StorefrontRoundedIcon />}
            >
              Browse products
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  }

  return <Outlet />;
}
