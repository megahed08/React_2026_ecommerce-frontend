import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Link } from "react-router";

import { SITE_CONFIG } from "../../../app/config/site";
import { SiteBrand } from "../branding/SiteBrand";

export function MainFooter() {
  const siteName = SITE_CONFIG.name || "Shop";

  const supportEmail = SITE_CONFIG.contact.supportEmail;

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 3,
            md: 4,
          },
        }}
      >
        <Stack spacing={3}>
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={3}
            sx={{
              justifyContent: "space-between",

              alignItems: {
                xs: "flex-start",
                md: "center",
              },
            }}
          >
            <Stack spacing={1}>
              <SiteBrand showNameOnMobile logoSize={36} />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: 420,
                }}
              >
                {SITE_CONFIG.description ||
                  "A modern storefront demonstration built with React."}
              </Typography>
            </Stack>

            <Stack
              component="nav"
              aria-label="Footer navigation"
              direction="row"
              spacing={0.5}
              sx={{
                flexWrap: "wrap",
                rowGap: 0.5,
              }}
            >
              <Button component={Link} to="/" color="inherit" size="small">
                Home
              </Button>

              <Button
                component={Link}
                to="/products"
                color="inherit"
                size="small"
              >
                Products
              </Button>

              <Button component={Link} to="/cart" color="inherit" size="small">
                Cart
              </Button>

              <Button
                component={Link}
                to="/account"
                color="inherit"
                size="small"
              >
                Account
              </Button>

              {supportEmail && (
                <Button
                  component="a"
                  href={`mailto:${supportEmail}`}
                  color="inherit"
                  size="small"
                >
                  Contact
                </Button>
              )}
            </Stack>
          </Stack>

          <Divider />

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            sx={{
              justifyContent: "space-between",

              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Frontend portfolio demo. Orders, payments, authentication, and
              product administration are simulated locally.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
