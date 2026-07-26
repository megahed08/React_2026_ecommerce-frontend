import { useEffect } from "react";

import { useMatches } from "react-router";

import { SITE_CONFIG } from "../config/site";

function getTitleFromHandle(handle: unknown): string | null {
  if (typeof handle !== "object" || handle === null) {
    return null;
  }

  const title = (
    handle as {
      title?: unknown;
    }
  ).title;

  if (typeof title !== "string") {
    return null;
  }

  return title.trim() || null;
}

export function DocumentTitleManager() {
  const matches = useMatches();

  const pageTitle =
    [...matches]
      .reverse()
      .map((match) => getTitleFromHandle(match.handle))
      .find((title): title is string => title !== null) ?? null;

  useEffect(() => {
    const siteTitle = SITE_CONFIG.shortName || SITE_CONFIG.name;

    document.title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
  }, [pageTitle]);

  return null;
}
