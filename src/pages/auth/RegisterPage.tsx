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

import { useAuth } from "../../hooks/auth/useAuth";
import type { RegisterRequest } from "../../types/auth";

interface RegistrationFormValues extends RegisterRequest {
  confirmPassword: string;
}

interface RegistrationLocationState {
  from?: string;
}

const INITIAL_FORM_VALUES: RegistrationFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function getSafeReturnPath(state: unknown): string {
  if (typeof state !== "object" || state === null) {
    return "/account";
  }

  const from = (state as RegistrationLocationState).from;

  if (
    typeof from !== "string" ||
    !from.startsWith("/") ||
    from.startsWith("//")
  ) {
    return "/account";
  }

  return from;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = getSafeReturnPath(location.state);

  const {
    register,
    isAuthenticated,
    isLoading: isAuthLoading,
    error,
    clearError,
  } = useAuth();

  const [values, setValues] =
    useState<RegistrationFormValues>(INITIAL_FORM_VALUES);

  const [validationError, setValidationError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(
    field: keyof RegistrationFormValues,
    value: string,
  ): void {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setValidationError(null);
    clearError();
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (values.password !== values.confirmPassword) {
      setValidationError("The passwords do not match.");

      return;
    }

    const request: RegisterRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };

    setIsSubmitting(true);

    const session = await register(request);

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

  const displayedError = validationError ?? error;

  return (
    <Box
      sx={{
        maxWidth: 520,
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
              Create account
            </Typography>

            <Typography color="text.secondary">
              Register to view your account and order history.
            </Typography>
          </Box>

          {displayedError && <Alert severity="error">{displayedError}</Alert>}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <TextField
              label="First name"
              name="firstName"
              value={values.firstName}
              onChange={(event) => {
                updateField("firstName", event.target.value);
              }}
              autoComplete="given-name"
              required
              fullWidth
              disabled={isSubmitting}
            />

            <TextField
              label="Last name"
              name="lastName"
              value={values.lastName}
              onChange={(event) => {
                updateField("lastName", event.target.value);
              }}
              autoComplete="family-name"
              required
              fullWidth
              disabled={isSubmitting}
            />
          </Stack>

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
            autoComplete="new-password"
            required
            fullWidth
            disabled={isSubmitting}
            helperText="Use at least 8 characters."
            slotProps={{
              htmlInput: {
                minLength: 8,
              },
            }}
          />

          <TextField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={(event) => {
              updateField("confirmPassword", event.target.value);
            }}
            autoComplete="new-password"
            required
            fullWidth
            disabled={isSubmitting}
            error={validationError !== null}
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
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center",
            }}
          >
            Already have an account?{" "}
            <Box
              component={Link}
              to="/login"
              state={{
                from: returnTo,
              }}
              sx={{
                color: "primary.main",
                fontWeight: 600,
              }}
            >
              Log in
            </Box>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
