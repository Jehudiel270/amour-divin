import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://amour-divin.vercel.app").replace(/\/$/, "");
  const now = new Date();

  const routes = [
    "",
    "/a-propos",
    "/comment-ca-marche",
    "/conditions",
    "/confidentialite",
    "/connexion",
    "/contact",
    "/decouvrir",
    "/faq",
    "/inscription",
    "/signaler",
  ];

  return routes.map((route) => ({
    url: `${appUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
