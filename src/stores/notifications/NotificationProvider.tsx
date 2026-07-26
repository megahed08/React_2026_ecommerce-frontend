import { useCallback, useMemo, useRef, useState } from "react";

import type { PropsWithChildren } from "react";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import {
  NotificationContext,
  type NotificationContextValue,
  type NotificationOptions,
  type NotificationSeverity,
} from "./notification-context";

interface ActiveNotification {
  id: number;
  message: string;
  severity: NotificationSeverity;
  autoHideDuration: number;
}

const DEFAULT_AUTO_HIDE_DURATION = 4500;

export function NotificationProvider({ children }: PropsWithChildren) {
  const nextNotificationId = useRef(0);

  const [activeNotification, setActiveNotification] =
    useState<ActiveNotification | null>(null);

  const showNotification = useCallback(
    (message: string, options: NotificationOptions = {}): void => {
      nextNotificationId.current += 1;

      setActiveNotification({
        id: nextNotificationId.current,
        message,
        severity: options.severity ?? "info",
        autoHideDuration:
          options.autoHideDuration ?? DEFAULT_AUTO_HIDE_DURATION,
      });
    },
    [],
  );

  const showSuccess = useCallback(
    (message: string, autoHideDuration?: number): void => {
      showNotification(message, {
        severity: "success",
        autoHideDuration,
      });
    },
    [showNotification],
  );

  const showInfo = useCallback(
    (message: string, autoHideDuration?: number): void => {
      showNotification(message, {
        severity: "info",
        autoHideDuration,
      });
    },
    [showNotification],
  );

  const showWarning = useCallback(
    (message: string, autoHideDuration?: number): void => {
      showNotification(message, {
        severity: "warning",
        autoHideDuration,
      });
    },
    [showNotification],
  );

  const showError = useCallback(
    (message: string, autoHideDuration?: number): void => {
      showNotification(message, {
        severity: "error",
        autoHideDuration,
      });
    },
    [showNotification],
  );

  const closeNotification = useCallback((): void => {
    setActiveNotification(null);
  }, []);

  const contextValue = useMemo<NotificationContextValue>(
    () => ({
      showNotification,
      showSuccess,
      showInfo,
      showWarning,
      showError,
      closeNotification,
    }),
    [
      showNotification,
      showSuccess,
      showInfo,
      showWarning,
      showError,
      closeNotification,
    ],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      <Snackbar
        key={activeNotification?.id}
        open={activeNotification !== null}
        autoHideDuration={
          activeNotification?.autoHideDuration ?? DEFAULT_AUTO_HIDE_DURATION
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={(_, reason) => {
          if (reason !== "clickaway") {
            closeNotification();
          }
        }}
      >
        <Alert
          severity={activeNotification?.severity ?? "info"}
          variant="filled"
          onClose={closeNotification}
          sx={{
            width: "100%",
          }}
        >
          {activeNotification?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}
