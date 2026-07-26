import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ReactNode } from "react";

import { Link, Outlet, useMatch } from "react-router";

import { MainFooter } from "../components/layout/footers/MainFooter";
import { MainHeader } from "../components/layout/headers/MainHeader";

interface AccountNavigationLinkProps {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
}

function AccountNavigationLink({
  to,
  label,
  icon,
  end = false,
}: AccountNavigationLinkProps) {
  const isActive = Boolean(
    useMatch({
      path: to,
      end,
    }),
  );

  return (
    <Button
      component={Link}
      to={to}
      variant={isActive ? "contained" : "text"}
      color={isActive ? "primary" : "inherit"}
      startIcon={icon}
      aria-current={isActive ? "page" : undefined}
      sx={{
        width: {
          xs: "auto",
          md: "100%",
        },

        minWidth: {
          xs: "max-content",
          md: 0,
        },

        flexShrink: 0,

        justifyContent: {
          xs: "center",
          md: "flex-start",
        },

        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Button>
  );
}

export function AccountLayout() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MainHeader />

      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flex: 1,

          py: {
            xs: 2,
            md: 4,
          },
        }}
      >
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "240px minmax(0, 1fr)",
            },

            gap: {
              xs: 2,
              md: 3,
            },

            alignItems: "start",
          }}
        >
          <Paper
            component="aside"
            variant="outlined"
            sx={{
              position: "sticky",

              top: {
                xs: 64,
                sm: 72,
                md: 88,
              },

              zIndex: (theme) => theme.zIndex.appBar - 1,

              overflow: "hidden",

              p: {
                xs: 1,
                md: 2,
              },

              bgcolor: "background.paper",
            }}
          >
            <Stack
              spacing={{
                xs: 1,
                md: 2,
              }}
            >
              <Box
                sx={{
                  display: {
                    xs: "none",
                    md: "block",
                  },
                }}
              >
                <Typography
                  component="h2"
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  My account
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Manage your profile and orders.
                </Typography>
              </Box>

              <Box
                component="nav"
                aria-label="Account navigation"
                sx={{
                  display: "flex",

                  flexDirection: {
                    xs: "row",
                    md: "column",
                  },

                  gap: 1,

                  overflowX: {
                    xs: "auto",
                    md: "visible",
                  },

                  overflowY: "hidden",

                  pb: {
                    xs: 0.5,
                    md: 0,
                  },

                  scrollbarWidth: "thin",

                  "&::-webkit-scrollbar": {
                    height: 5,
                  },

                  "&::-webkit-scrollbar-thumb": {
                    borderRadius: 999,
                    bgcolor: "action.disabled",
                  },
                }}
              >
                <AccountNavigationLink
                  to="/account"
                  label="Overview"
                  icon={<DashboardRoundedIcon />}
                  end
                />

                <AccountNavigationLink
                  to="/account/profile"
                  label="Profile"
                  icon={<ManageAccountsRoundedIcon />}
                />

                <AccountNavigationLink
                  to="/account/orders"
                  label="Orders"
                  icon={<ReceiptLongRoundedIcon />}
                />
              </Box>
            </Stack>
          </Paper>

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Container>

      <MainFooter />
    </Box>
  );
}
