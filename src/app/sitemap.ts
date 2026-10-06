import type { MetadataRoute } from "next";
import { catalog } from "@/lib/fleet";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...catalog.map((c) => ({ url: `${site.url}${c.href}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
