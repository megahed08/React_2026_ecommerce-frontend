import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "../../../hooks/auth/useAuth";

export function RequireAuth() {
  const location = useLocation();

  const { isAuthenticated, isLoading } = useAuth();

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

  return <Outlet />;
}
