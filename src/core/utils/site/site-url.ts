import { getAppUrl } from "@/core/utils/site/app-url";

/** URL canónica do site (metadata, sitemap, Open Graph). */
export function getCanonicalSiteUrlString(): string {
  return getAppUrl();
}

/** `URL` para `metadataBase` e links internos. */
export function getCanonicalSiteUrlObject(): URL {
  return new URL(getAppUrl());
}
