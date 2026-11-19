import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://amour-divin.vercel.app").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/paiement/", "/profil/", "/demandes/", "/messages/", "/notifications/", "/favoris/", "/matchs/", "/reglages/", "/securite/"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
