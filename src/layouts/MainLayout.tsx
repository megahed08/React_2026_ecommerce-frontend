import { Box, Container } from "@mui/material";
import { Outlet } from "react-router";
import { MainHeader } from "../components/layout/headers/MainHeader";
import { MainFooter } from "../components/layout/footers/MainFooter";

export function MainLayout() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MainHeader />

      <Box
        component="main"
        sx={{
          flex: 1,
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>

      <MainFooter />
    </Box>
  );
}
