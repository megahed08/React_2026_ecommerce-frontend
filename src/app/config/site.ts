function readEnvironmentValue(
  value: string | undefined,
  fallback: string,
): string {
  const normalizedValue = value?.trim();

  return normalizedValue || fallback;
}

function readOptionalEnvironmentValue(
  value: string | undefined,
): string | null {
  const normalizedValue = value?.trim();

  return normalizedValue || null;
}

function removeTrailingSlashes(value: string): string {
  return value === "/" ? value : value.replace(/\/+$/, "");
}

const siteName = readEnvironmentValue(import.meta.env.VITE_SITE_NAME, "Shop");

const siteUrl = removeTrailingSlashes(
  readEnvironmentValue(import.meta.env.VITE_SITE_URL, window.location.origin),
);

const apiBaseUrl = removeTrailingSlashes(
  readEnvironmentValue(import.meta.env.VITE_API_BASE_URL, "/api"),
);

export const SITE_CONFIG = {
  name: siteName,

  shortName: readEnvironmentValue(
    import.meta.env.VITE_SITE_SHORT_NAME,
    siteName,
  ),

  description: readEnvironmentValue(
    import.meta.env.VITE_SITE_DESCRIPTION,
    "A modern storefront built with React.",
  ),

  siteUrl,

  apiBaseUrl,

  brand: {
    logo: readEnvironmentValue(
      import.meta.env.VITE_LOGO_PATH,
      "/brand/logo.svg",
    ),

    faviconPath: readEnvironmentValue(
      import.meta.env.VITE_FAVICON_PATH,
      "/brand/favicon.svg",
    ),
  },

  socialLinks: {
    twitter: readOptionalEnvironmentValue(
      import.meta.env.VITE_SOCIAL_LINKS_TWITTER,
    ),

    facebook: readOptionalEnvironmentValue(
      import.meta.env.VITE_SOCIAL_LINKS_FACEBOOK,
    ),

    instagram: readOptionalEnvironmentValue(
      import.meta.env.VITE_SOCIAL_LINKS_INSTAGRAM,
    ),
  },

  contact: {
    supportEmail: readOptionalEnvironmentValue(
      import.meta.env.VITE_CONTACT_EMAIL,
    ),
  },
} as const;
