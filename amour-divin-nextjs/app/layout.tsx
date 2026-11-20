import type { Metadata, Viewport } from "next";

import "./globals.css";
import Navbar from "@/components/shared/navbar";
import { getChurchName } from "@/lib/site";

const churchName = getChurchName();
const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://amour-divin.vercel.app").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  applicationName: churchName,
  authors: [{ name: churchName }],
  creator: churchName,
  publisher: churchName,
  category: "dating",
  keywords: [
    "rencontres chrétiennes",
    "site de rencontre chrétien",
    "célibataires chrétiens",
    "rencontre sérieuse",
    "Amour Divin",
  ],
  title: {
    default: `${churchName} — Rencontres sérieuses entre adultes chrétiens`,
    template: "%s · Amour Divin",
  },
  description:
    `${churchName} réunit les membres adultes de l'église pour des rencontres chrétiennes sérieuses. Service réservé aux 18 ans et plus.`,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "64x64" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: churchName,
    title: `${churchName} — Rencontres sérieuses entre adultes chrétiens`,
    description:
      "Rencontrez des adultes chrétiens qui partagent vos valeurs, votre foi et votre projet de relation sérieuse.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Amour Divin — Rencontres chrétiennes sérieuses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${churchName} — Rencontres chrétiennes sérieuses`,
    description:
      "Une communauté chrétienne bienveillante pour des rencontres sincères et durables.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2744" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-body antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
