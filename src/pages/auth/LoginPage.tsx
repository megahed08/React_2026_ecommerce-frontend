import { useState, type SubmitEvent } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Link, Navigate, useLocation, useNavigate } from "react-router";

import { DEMO_ADMIN_CONFIG } from "../../app/config/demo-auth";
import { useAuth } from "../../hooks/auth/useAuth";
import type { LoginRequest } from "../../types/auth";

interface LoginLocationState {
  from?: string;
}

const INITIAL_VALUES: LoginRequest = {
  email: "",
  password: "",
};

const DEMO_ADMIN_CREDENTIALS: LoginRequest = {
  email: DEMO_ADMIN_CONFIG.email,
  password: DEMO_ADMIN_CONFIG.password,
};

function getSafeReturnPath(state: unknown): string {
  if (typeof state !== "object" || state === null) {
    return "/account";
  }

  const from = (state as LoginLocationState).from;

  if (
    typeof from !== "string" ||
    !from.startsWith("/") ||
    from.startsWith("//")
  ) {
    return "/account";
  }

  return from;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = getSafeReturnPath(location.state);

  const {
    login,
    isAuthenticated,
    isLoading: isAuthLoading,
    error,
    clearError,
  } = useAuth();

  const [values, setValues] = useState<LoginRequest>(INITIAL_VALUES);

  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof LoginRequest, value: string): void {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    clearError();
  }

  function useAdminCredentials(): void {
    setValues(DEMO_ADMIN_CREDENTIALS);

    clearError();
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const session = await login(values);

    setIsSubmitting(false);

    if (!session) {
      return;
    }

    navigate(returnTo, {
      replace: true,
    });
  }

  if (isAuthenticated) {
    return <Navigate to={returnTo} replace />;
  }

  if (isAuthLoading && !isSubmitting) {
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

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: "auto",
      }}
    >
      <Paper
        component="form"
        variant="outlined"
        onSubmit={handleSubmit}
        sx={{
          p: {
            xs: 3,
            sm: 4,
          },
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 700,
              }}
            >
              Log in
            </Typography>

            <Typography color="text.secondary">
              Sign in to view your account, orders, or product-management tools.
            </Typography>
          </Box>

          <Alert
            severity="info"
            action={
              <Button
                type="button"
                color="inherit"
                size="small"
                disabled={isSubmitting}
                onClick={useAdminCredentials}
              >
                Use account
              </Button>
            }
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
              }}
            >
              Demo administrator
            </Typography>

            <Typography variant="body2">
              {DEMO_ADMIN_CONFIG.email}
              {" / "}
              {DEMO_ADMIN_CONFIG.password}
            </Typography>
          </Alert>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => {
              updateField("email", event.target.value);
            }}
            autoComplete="email"
            required
            fullWidth
            disabled={isSubmitting}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={(event) => {
              updateField("password", event.target.value);
            }}
            autoComplete="current-password"
            required
            fullWidth
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
            }}
          >
            Do not have an account?{" "}
            <Box
              component={Link}
              to="/register"
              state={{
                from: returnTo,
              }}
              sx={{
                color: "primary.main",
                fontWeight: 600,
              }}
            >
              Create one
            </Box>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
