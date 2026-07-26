export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}

export type UserRole = "customer" | "admin";

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}
