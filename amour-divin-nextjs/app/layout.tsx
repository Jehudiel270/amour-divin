import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/shared/navbar";

const churchName = process.env.NEXT_PUBLIC_CHURCH_NAME || "Amour Divin";

export const metadata: Metadata = {
  title: {
    default: `${churchName} — Rencontres sérieuses entre adultes chrétiens`,
    template: "%s · Amour Divin",
  },
  description:
    `${churchName} réunit les membres adultes de l'église pour des rencontres chrétiennes sérieuses. Service réservé aux 18 ans et plus.`,
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
