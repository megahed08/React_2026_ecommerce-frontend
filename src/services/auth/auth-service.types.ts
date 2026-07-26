import type {
  AuthSession,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from "../../types/auth";

export interface AuthService {
  getSession(): Promise<AuthSession | null>;

  login(request: LoginRequest): Promise<AuthSession>;

  register(request: RegisterRequest): Promise<AuthSession>;

  updateProfile(request: UpdateProfileRequest): Promise<AuthSession>;

  logout(): Promise<void>;
}
