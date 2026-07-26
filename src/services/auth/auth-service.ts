import { mockAuthService } from "./mock-auth-service";
import type { AuthService } from "./auth-service.types";

/*
 * Authentication is simulated locally in this
 * standalone frontend.
 *
 * The future full-stack version can select an API
 * implementation here while preserving the same
 * AuthService contract.
 */
export const authService: AuthService = mockAuthService;
