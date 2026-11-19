"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Flag, ShieldCheck, Mail, Shield, ArrowLeft, CreditCard, Menu, X } from "lucide-react";

type Permission = "dashboard" | "users" | "profiles" | "reports" | "contact" | "billing";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", permission: "dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/admin/utilisateurs", label: "Utilisateurs", permission: "users", icon: <Users size={18} /> },
  { href: "/admin/signalements", label: "Signalements", permission: "reports", icon: <Flag size={18} /> },
  { href: "/admin/verifications", label: "Vérifications", permission: "profiles", icon: <ShieldCheck size={18} /> },
  { href: "/admin/contact", label: "Contact", permission: "contact", icon: <Mail size={18} /> },
  { href: "/admin/tarifs", label: "Tarifs", permission: "billing", icon: <CreditCard size={18} /> },
  { href: "/admin/equipe", label: "Équipe", permission: null, icon: <Shield size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState<"admin" | "super_admin" | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const response = await fetch("/api/admin/me");
        if (!response.ok) return;
        const context = await response.json();
        if (active) {
          setRole(context.role);
          setPermissions(Array.isArray(context.permissions) ? context.permissions : []);
        }
      } catch {}
    })();
    return () => {
      active = false;
    };
  }, []);
  const visibleLinks = LINKS.filter((link) => {
    if (link.href === "/admin/equipe") return role === "super_admin";
    return role === "super_admin" || (link.permission !== null && permissions.includes(link.permission as Permission));
  });

  return (
    <div className="min-h-screen bg-[var(--color-cream)] md:flex">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 px-4 md:hidden" style={{ background: "var(--color-midnight)" }}>
        <Link href="/admin" className="flex items-center gap-2 text-white"><span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/10 font-display font-bold">AD</span><span className="text-sm font-semibold">Administration</span></Link>
        <button type="button" aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setMobileMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-xl text-white/80 hover:bg-white/10">{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </header>
      {mobileMenuOpen && (
        <nav className="border-b border-white/10 px-3 py-3 md:hidden" style={{ background: "var(--color-midnight)" }}>
          {visibleLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${pathname === link.href ? "bg-white/10 text-white" : "text-white/65"}`}>{link.icon}{link.label}</Link>
          ))}
        </nav>
      )}
      <aside className="hidden w-72 flex-shrink-0 p-5 md:flex md:flex-col" style={{ background: "var(--color-midnight)" }}>
        <Link href="/admin" className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-white/10 shadow-sm">
            <span className="text-white font-display font-bold text-sm">AD</span>
          </div>
          <span className="font-display font-semibold text-white">Administration</span>
        </Link>
        <nav className="flex-1 flex flex-col gap-1">
          {visibleLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
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
