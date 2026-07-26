import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { Outlet } from "react-router";

import { CheckoutHeader } from "../components/layout/headers/CheckoutHeader";

export function CheckoutLayout() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <CheckoutHeader />

      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flex: 1,
          py: {
            xs: 3,
            md: 4,
          },
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
