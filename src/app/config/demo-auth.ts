function getRequiredEnvironmentValue(
  name: string,
  value: string | undefined,
): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const email = getRequiredEnvironmentValue(
  "VITE_DEMO_ADMIN_EMAIL",
  import.meta.env.VITE_DEMO_ADMIN_EMAIL,
)
  .trim()
  .toLowerCase();

const password = getRequiredEnvironmentValue(
  "VITE_DEMO_ADMIN_PASSWORD",
  import.meta.env.VITE_DEMO_ADMIN_PASSWORD,
);

export const DEMO_ADMIN_CONFIG = {
  id: "demo-admin",
  firstName: "Demo",
  lastName: "Administrator",
  email,
  password,
} as const;
