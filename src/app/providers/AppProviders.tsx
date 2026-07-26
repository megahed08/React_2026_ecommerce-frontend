import type { ReactNode } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { AuthProvider } from "../../stores/auth/AuthProvider";
import { CartProvider } from "../../stores/cart/CartProvider";
import { NotificationProvider } from "../../stores/notifications/NotificationProvider";

import { theme } from "../theme/theme";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      theme={theme}
      defaultMode="system"
      noSsr
      disableTransitionOnChange
    >
      <CssBaseline />

      <NotificationProvider>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
