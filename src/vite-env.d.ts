/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_NAME?: string;

  readonly VITE_SITE_SHORT_NAME?: string;

  readonly VITE_SITE_DESCRIPTION?: string;

  readonly VITE_SITE_URL?: string;

  readonly VITE_API_BASE_URL?: string;

  readonly VITE_LOGO_PATH?: string;

  readonly VITE_FAVICON_PATH?: string;

  readonly VITE_SOCIAL_LINKS_TWITTER?: string;

  readonly VITE_SOCIAL_LINKS_FACEBOOK?: string;

  readonly VITE_SOCIAL_LINKS_INSTAGRAM?: string;

  readonly VITE_CONTACT_EMAIL?: string;

  readonly VITE_DEMO_ADMIN_EMAIL?: string;

  readonly VITE_DEMO_ADMIN_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
