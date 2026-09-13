import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/shared/navbar";

export const metadata: Metadata = {
  title: {
    default: "Amour Divin (AD) — Rencontres sérieuses entre jeunes chrétiens",
    template: "%s · Amour Divin",
  },
  description:
    "AD réunit de jeunes adultes chrétiens qui cherchent l'amour authentique — pas juste une rencontre, mais une relation qui dure. Service réservé aux 18 ans et plus.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-body antialiased">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
