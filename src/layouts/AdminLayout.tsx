import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { Outlet } from "react-router";

import { MainFooter } from "../components/layout/footers/MainFooter";
import { MainHeader } from "../components/layout/headers/MainHeader";

export function AdminLayout() {
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
          py: {
            xs: 3,
            md: 4,
          },
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Outlet />
          </Stack>
        </Container>
      </Box>

      <MainFooter />
    </Box>
  );
}
