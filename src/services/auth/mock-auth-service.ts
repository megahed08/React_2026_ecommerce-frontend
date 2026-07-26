import { DEMO_ADMIN_CONFIG } from "../../app/config/demo-auth";

import type {
  AuthSession,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  User,
  UserRole,
} from "../../types/auth";

import type { AuthService } from "./auth-service.types";

interface StoredUser extends User {
  passwordHash: string;
}

interface StoredSession {
  userId: string;
  accessToken: string;
}

const USERS_STORAGE_KEY = "shop.auth.users";

const SESSION_STORAGE_KEY = "shop.auth.session";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isUserRole(value: unknown): value is UserRole {
  return value === "customer" || value === "admin";
}

function isStoredUser(value: unknown): value is StoredUser {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const user = value as Partial<StoredUser>;

  return (
    typeof user.id === "string" &&
    typeof user.firstName === "string" &&
    typeof user.lastName === "string" &&
    typeof user.email === "string" &&
    isUserRole(user.role) &&
    typeof user.passwordHash === "string"
  );
}

function isStoredSession(value: unknown): value is StoredSession {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const session = value as Partial<StoredSession>;

  return (
    typeof session.userId === "string" &&
    typeof session.accessToken === "string"
  );
}

function saveUsers(users: StoredUser[]): void {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

async function hashPassword(password: string): Promise<string> {
  const encodedPassword = new TextEncoder().encode(password);

  const digest = await window.crypto.subtle.digest("SHA-256", encodedPassword);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function createDemoAdminUser(): Promise<StoredUser> {
  return {
    id: DEMO_ADMIN_CONFIG.id,
    firstName: DEMO_ADMIN_CONFIG.firstName,
    lastName: DEMO_ADMIN_CONFIG.lastName,
    email: DEMO_ADMIN_CONFIG.email,
    role: "admin",

    passwordHash: await hashPassword(DEMO_ADMIN_CONFIG.password),
  };
}

async function ensureDemoAdminUser(users: StoredUser[]): Promise<StoredUser[]> {
  const demoAdmin = await createDemoAdminUser();

  const existingAdminIndex = users.findIndex(
    (user) =>
      user.id === demoAdmin.id ||
      normalizeEmail(user.email) === demoAdmin.email,
  );

  if (existingAdminIndex === -1) {
    const updatedUsers = [...users, demoAdmin];

    saveUsers(updatedUsers);

    return updatedUsers;
  }

  const existingAdmin = users[existingAdminIndex];

  const requiresUpdate =
    existingAdmin.id !== demoAdmin.id ||
    existingAdmin.firstName !== demoAdmin.firstName ||
    existingAdmin.lastName !== demoAdmin.lastName ||
    normalizeEmail(existingAdmin.email) !== demoAdmin.email ||
    existingAdmin.role !== "admin" ||
    existingAdmin.passwordHash !== demoAdmin.passwordHash;

  if (!requiresUpdate) {
    return users;
  }

  const updatedUsers = [...users];

  updatedUsers[existingAdminIndex] = demoAdmin;

  saveUsers(updatedUsers);

  return updatedUsers;
}

async function loadUsers(): Promise<StoredUser[]> {
  let validUsers: StoredUser[] = [];

  try {
    const storedValue = window.localStorage.getItem(USERS_STORAGE_KEY);

    if (storedValue) {
      const parsedValue: unknown = JSON.parse(storedValue);

      if (Array.isArray(parsedValue)) {
        validUsers = parsedValue.filter(isStoredUser);
      }
    }
  } catch {
    validUsers = [];
  }

  return ensureDemoAdminUser(validUsers);
}

function loadStoredSession(): StoredSession | null {
  try {
    const storedValue = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!storedValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    return isStoredSession(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

function saveStoredSession(session: StoredSession): void {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function removeStoredSession(): void {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

function toPublicUser(storedUser: StoredUser): User {
  return {
    id: storedUser.id,
    firstName: storedUser.firstName,
    lastName: storedUser.lastName,
    email: storedUser.email,
    role: storedUser.role,
  };
}

function createSession(storedUser: StoredUser): AuthSession {
  const accessToken = window.crypto.randomUUID();

  saveStoredSession({
    userId: storedUser.id,
    accessToken,
  });

  return {
    user: toPublicUser(storedUser),
    accessToken,
  };
}

function validateRegistration(request: RegisterRequest): void {
  if (!request.firstName.trim() || !request.lastName.trim()) {
    throw new Error("First name and last name are required.");
  }

  if (!request.email.includes("@")) {
    throw new Error("Enter a valid email address.");
  }

  if (request.password.length < 8) {
    throw new Error("Password must contain at least 8 characters.");
  }
}

export const mockAuthService: AuthService = {
  async getSession() {
    const storedSession = loadStoredSession();

    if (!storedSession) {
      return null;
    }

    const users = await loadUsers();

    const storedUser = users.find((user) => user.id === storedSession.userId);

    if (!storedUser) {
      removeStoredSession();

      return null;
    }

    return {
      user: toPublicUser(storedUser),

      accessToken: storedSession.accessToken,
    };
  },

  async login(request: LoginRequest) {
    const normalizedEmail = normalizeEmail(request.email);

    const users = await loadUsers();

    const storedUser = users.find(
      (user) => normalizeEmail(user.email) === normalizedEmail,
    );

    if (!storedUser) {
      throw new Error("Invalid email or password.");
    }

    const passwordHash = await hashPassword(request.password);

    if (passwordHash !== storedUser.passwordHash) {
      throw new Error("Invalid email or password.");
    }

    return createSession(storedUser);
  },

  async register(request: RegisterRequest) {
    validateRegistration(request);

    const normalizedEmail = normalizeEmail(request.email);

    const users = await loadUsers();

    const userAlreadyExists = users.some(
      (user) => normalizeEmail(user.email) === normalizedEmail,
    );

    if (userAlreadyExists) {
      throw new Error("An account with this email already exists.");
    }

    const storedUser: StoredUser = {
      id: window.crypto.randomUUID(),

      firstName: request.firstName.trim(),

      lastName: request.lastName.trim(),

      email: normalizedEmail,
      role: "customer",

      passwordHash: await hashPassword(request.password),
    };

    saveUsers([...users, storedUser]);

    return createSession(storedUser);
  },

  async updateProfile(request: UpdateProfileRequest): Promise<AuthSession> {
    const storedSession = loadStoredSession();

    if (!storedSession) {
      throw new Error("You must be logged in to update your profile.");
    }

    const firstName = request.firstName.trim();

    const lastName = request.lastName.trim();

    const normalizedEmail = normalizeEmail(request.email);

    if (!firstName || !lastName) {
      throw new Error("First name and last name are required.");
    }

    if (!normalizedEmail.includes("@")) {
      throw new Error("Enter a valid email address.");
    }

    const users = await loadUsers();

    const currentUserIndex = users.findIndex(
      (user) => user.id === storedSession.userId,
    );

    if (currentUserIndex === -1) {
      removeStoredSession();

      throw new Error("The authenticated user could not be found.");
    }

    const emailAlreadyExists = users.some(
      (user, index) =>
        index !== currentUserIndex &&
        normalizeEmail(user.email) === normalizedEmail,
    );

    if (emailAlreadyExists) {
      throw new Error("An account with this email already exists.");
    }

    const updatedUser: StoredUser = {
      ...users[currentUserIndex],
      firstName,
      lastName,
      email: normalizedEmail,
    };

    const updatedUsers = [...users];

    updatedUsers[currentUserIndex] = updatedUser;

    saveUsers(updatedUsers);

    return {
      user: toPublicUser(updatedUser),

      accessToken: storedSession.accessToken,
    };
  },

  async logout() {
    removeStoredSession();
  },
};
