"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Flag, ShieldCheck, ArrowLeft } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: <Users size={18} /> },
  { href: "/admin/signalements", label: "Signalements", icon: <Flag size={18} /> },
  { href: "/admin/verifications", label: "Vérifications", icon: <ShieldCheck size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[var(--color-cream)]">
      <aside className="w-64 flex-shrink-0 p-4 flex flex-col" style={{ background: "var(--color-midnight)" }}>
        <Link href="/admin" className="flex items-center gap-2 px-2 mb-8 mt-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10">
            <span className="text-white font-display font-bold text-sm">AD</span>
          </div>
          <span className="font-display font-semibold text-white">Administration</span>
        </Link>
        <nav className="flex-1 flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                pathname === l.href ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {l.icon} {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/decouvrir" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors">
          <ArrowLeft size={18} /> Retour à l&apos;application
        </Link>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
