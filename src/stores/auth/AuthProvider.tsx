import { useCallback, useEffect, useMemo, useState } from "react";

import type { ReactNode } from "react";

import { authService } from "../../services/auth/auth-service";

import type {
  AuthSession,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from "../../types/auth";

import { AuthContext, type AuthContextValue } from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "The authentication operation failed.";
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const reloadSession = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const restoredSession = await authService.getSession();

      setSession(restoredSession);
    } catch (caughtError) {
      setSession(null);
      setError(getErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restoreInitialSession() {
      try {
        const restoredSession = await authService.getSession();

        if (!cancelled) {
          setSession(restoredSession);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setSession(null);

          setError(getErrorMessage(caughtError));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void restoreInitialSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (request: LoginRequest): Promise<AuthSession | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const authenticatedSession = await authService.login(request);

        setSession(authenticatedSession);

        return authenticatedSession;
      } catch (caughtError) {
        setSession(null);
        setError(getErrorMessage(caughtError));

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const register = useCallback(
    async (request: RegisterRequest): Promise<AuthSession | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const authenticatedSession = await authService.register(request);

        setSession(authenticatedSession);

        return authenticatedSession;
      } catch (caughtError) {
        setSession(null);
        setError(getErrorMessage(caughtError));

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const updateProfile = useCallback(
    async (request: UpdateProfileRequest): Promise<AuthSession | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedSession = await authService.updateProfile(request);

        setSession(updatedSession);

        return updatedSession;
      } catch (caughtError) {
        setError(getErrorMessage(caughtError));

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setSession(null);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,

      isAuthenticated: session !== null,

      isLoading,
      error,

      login,
      register,
      updateProfile,
      logout,
      reloadSession,
      clearError,
    }),
    [
      session,
      isLoading,
      error,
      login,
      register,
      updateProfile,
      logout,
      reloadSession,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
