import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Link, useLocation, useNavigate } from "react-router";

export function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        py: {
          xs: 6,
          md: 10,
        },
      }}
    >
      <Paper
        variant="outlined"
        component="section"
        sx={{
          position: "relative",
          overflow: "hidden",
          p: {
            xs: 3,
            sm: 5,
            md: 7,
          },
          textAlign: "center",
          borderRadius: 4,
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            backgroundColor: "action.hover",
            top: -120,
            right: -80,
          }}
        />

        <Stack
          spacing={3}
          sx={{
            position: "relative",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: "50%",
              color: "primary.main",
              backgroundColor: "action.hover",
            }}
          >
            <SearchOffRoundedIcon
              sx={{
                fontSize: 48,
              }}
            />
          </Box>

          <Box>
            <Typography
              component="p"
              variant="overline"
              color="primary.main"
              sx={{
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              Error 404
            </Typography>

            <Typography
              component="h1"
              variant="h3"
              sx={{
                mt: 1,
                fontWeight: 800,
              }}
            >
              Page not found
            </Typography>
          </Box>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 560,
            }}
          >
            The page you are looking for may have been moved, removed, or the
            address may be incorrect.
          </Typography>

          <Box
            component="code"
            sx={{
              maxWidth: "100%",
              px: 2,
              py: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              borderRadius: 1,
              color: "text.secondary",
              backgroundColor: "action.hover",
              fontFamily: "monospace",
            }}
          >
            {location.pathname}
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
              to="/"
              variant="contained"
              size="large"
              startIcon={<HomeRoundedIcon />}
            >
              Go to home
            </Button>

            <Button
              component={Link}
              to="/products"
              variant="outlined"
              size="large"
              startIcon={<StorefrontRoundedIcon />}
            >
              Browse products
            </Button>

            <Button
              type="button"
              variant="text"
              size="large"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => {
                navigate(-1);
              }}
            >
              Go back
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
