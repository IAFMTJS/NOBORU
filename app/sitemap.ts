import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://noboru.app";

  return [
    { url: `${baseUrl}/login`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/register`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
