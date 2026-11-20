"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Bell, Heart, MessageCircle, Settings, LogOut, User, ShieldCheck, Sun, Moon } from "lucide-react";

import { authClient } from "@/lib/auth/client";
import { getChurchName } from "@/lib/site";
import type { ReactNode } from "react"
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("ad-theme");
    const resolved = stored === "dark"
      ? "dark"
      : stored === "light"
        ? "light"
        : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    queueMicrotask(() => setTheme(resolved));
  }, []);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isLoggedIn = Boolean(session?.user);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    let active = true;
    void fetch("/api/admin/me")
      .then((response) => response.ok ? response.json() : null)
      .then((context) => {
        if (active) setIsAdmin(Boolean(context?.role));
      })
      .catch(() => {
        if (active) setIsAdmin(false);
      });
    return () => { active = false; };
  }, [isLoggedIn]);

  const logout = async () => {
    await authClient.signOut();
    setIsAdmin(false);
    setUserMenuOpen(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("ad-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

  const isAuthPage = ["/connexion", "/inscription", "/mot-de-passe-oublie", "/reinitialiser-mot-de-passe"].includes(pathname);

  if (isAuthPage) return null;

  const publicLinks = [
    { href: "/comment-ca-marche", label: "Comment ça marche" },
    { href: "/a-propos", label: "Nos valeurs" },
    { href: "/securite", label: "Sécurité" },
  ];

  const privateLinks = [
    { href: "/decouvrir", label: "Découvrir", icon: <User size={16} /> },
    { href: "/matchs", label: "Matchs", icon: <Heart size={16} /> },
    { href: "/messages", label: "Messages", icon: <MessageCircle size={16} /> },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--color-beige-dark)]"
      style={{ boxShadow: "0 8px 28px rgba(26,39,68,0.07)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
            >
              <span className="text-white font-display font-bold text-base">AD</span>
            </div>
            <span className="font-display font-semibold text-lg text-[var(--color-midnight)] hidden sm:block">{getChurchName()}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {(isLoggedIn ? privateLinks : publicLinks).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  pathname === l.href ? "text-[var(--color-midnight)]" : "text-slate-500 hover:text-[var(--color-midnight)]"
                }`}
              >
                {"icon" in l ? (l.icon as ReactNode) : null}
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-xl border border-[var(--color-lavender)] px-3 py-2 text-sm font-semibold text-[var(--color-midnight)] hover:bg-[var(--color-lavender-light)]"
              >
                <ShieldCheck size={16} />
                Administration
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"}
              title={theme === "dark" ? "Thème clair" : "Thème sombre"}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-beige-dark)] bg-white text-[var(--color-midnight)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--color-lavender)] hover:text-[var(--color-lavender)]"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isLoggedIn ? (
              <>
                <Link
                  href="/favoris"
                  className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl hover:bg-[var(--color-lavender-light)] text-slate-500 hover:text-[var(--color-lavender)] transition-all"
                >
                  <Heart size={18} />
                </Link>
                <Link
                  href="/notifications"
                  className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-xl hover:bg-[var(--color-lavender-light)] text-slate-500 hover:text-[var(--color-lavender)] transition-all"
                >
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="Ouvrir le menu du compte"
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--color-lavender-light)] text-[var(--color-midnight)] font-semibold ring-2 ring-[var(--color-lavender-light)] hover:ring-[var(--color-lavender)] transition-all"
                  >
                    {(session?.user?.name || session?.user?.email || "M").slice(0, 1).toUpperCase()}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-[var(--color-beige-dark)] py-2 z-50">
                      <Link
                        href="/reglages"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-[var(--color-beige)] transition-colors"
                      >
                        <Settings size={16} className="text-slate-400" /> Réglages
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-[var(--color-beige)] transition-colors"
                        >
                          <ShieldCheck size={16} className="text-slate-400" /> Administration
                        </Link>
                      )}
                      <hr className="my-1 border-[var(--color-beige-dark)]" />
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
                      >
                        <LogOut size={16} /> Se déconnecter
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/connexion" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-[var(--color-midnight)] transition-colors">
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
                >
                  Créer un compte
                </Link>
              </>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-[var(--color-beige)] transition-colors">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[var(--color-beige-dark)] px-4 py-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 py-2 text-sm font-medium text-slate-700"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            {theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
          </button>
          {(isLoggedIn ? privateLinks : publicLinks).map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium text-slate-700 hover:text-[var(--color-midnight)] transition-colors">
              {l.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <>
              <Link href="/connexion" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-slate-600">
                Connexion
              </Link>
              <Link
                href="/inscription"
                onClick={() => setMenuOpen(false)}
                className="py-2 px-4 rounded-xl text-sm font-semibold text-white text-center"
                style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
              >
                Créer un compte
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <Link href="/notifications" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-slate-600">
                Notifications
              </Link>
              <Link href="/favoris" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-slate-600">
                Favoris
              </Link>
              <Link href="/reglages" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-slate-600">
                Réglages
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-slate-600">
                  Administration
                </Link>
              )}
              <button
                onClick={logout}
                className="py-2 text-sm text-red-500 text-left"
              >
                Se déconnecter
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
