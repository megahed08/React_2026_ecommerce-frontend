import { useState, type SubmitEvent } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useAuth } from "../../hooks/auth/useAuth";
import { useNotification } from "../../hooks/notifications/useNotification";
import type { UpdateProfileRequest } from "../../types/auth";

export function ProfilePage() {
  const { user, updateProfile, isLoading, error, clearError } = useAuth();

  const { showSuccess } = useNotification();

  const [values, setValues] = useState<UpdateProfileRequest>(() => ({
    firstName: user?.firstName ?? "",

    lastName: user?.lastName ?? "",

    email: user?.email ?? "",
  }));

  if (!user) {
    return null;
  }

  function updateField(field: keyof UpdateProfileRequest, value: string): void {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    clearError();
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const updatedSession = await updateProfile(values);

    if (!updatedSession) {
      return;
    }

    setValues({
      firstName: updatedSession.user.firstName,

      lastName: updatedSession.user.lastName,

      email: updatedSession.user.email,
    });

    showSuccess("Your profile was updated successfully.");
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography component="h1" variant="h4">
          Profile
        </Typography>

        <Typography color="text.secondary">
          Update your personal account information.
        </Typography>
      </Box>

      <Paper
        component="form"
        variant="outlined"
        onSubmit={handleSubmit}
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
          maxWidth: 700,
        }}
      >
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}

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
              disabled={isLoading}
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
              disabled={isLoading}
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
            disabled={isLoading}
          />

          <Typography variant="body2" color="text.secondary">
            Updating your email also changes the address you use to log in.
          </Typography>

          <Box>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
