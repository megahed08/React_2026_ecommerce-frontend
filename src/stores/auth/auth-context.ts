import { createContext } from "react";

import type {
  AuthSession,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  User,
} from "../../types/auth";

export interface AuthContextValue {
  session: AuthSession | null;
  user: User | null;

  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login(request: LoginRequest): Promise<AuthSession | null>;

  register(request: RegisterRequest): Promise<AuthSession | null>;

  updateProfile(request: UpdateProfileRequest): Promise<AuthSession | null>;

  logout(): Promise<void>;

  reloadSession(): Promise<void>;
  clearError(): void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
