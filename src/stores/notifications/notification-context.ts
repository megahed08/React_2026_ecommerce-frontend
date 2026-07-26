import { createContext } from "react";

export type NotificationSeverity = "success" | "info" | "warning" | "error";

export interface NotificationOptions {
  severity?: NotificationSeverity;
  autoHideDuration?: number;
}

export interface NotificationContextValue {
  showNotification(message: string, options?: NotificationOptions): void;

  showSuccess(message: string, autoHideDuration?: number): void;

  showInfo(message: string, autoHideDuration?: number): void;

  showWarning(message: string, autoHideDuration?: number): void;

  showError(message: string, autoHideDuration?: number): void;

  closeNotification(): void;
}

export const NotificationContext = createContext<
  NotificationContextValue | undefined
>(undefined);
