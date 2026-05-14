import type { MetadataRoute } from "next";

import { getCanonicalSiteUrlString } from "@/core/utils/site/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getCanonicalSiteUrlString().replace(/\/$/, "");
  const now = new Date();

  const paths = [
    "",
    "/login",
    "/register",
    "/forgot-password",
  ];

  return paths.map((path) => ({
    url: `${base}${path}` || base,
    lastModified: now,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }));
}
