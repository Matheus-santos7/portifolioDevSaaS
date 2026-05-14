import type { MetadataRoute } from "next";

import { getCanonicalSiteUrlString } from "@/core/utils/site/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalSiteUrlString().replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
