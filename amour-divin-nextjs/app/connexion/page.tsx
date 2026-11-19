"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

import { authClient } from "@/lib/auth/client";
import { translateAuthError } from "@/lib/auth/messages";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await authClient.signIn.email({ email: form.email, password: form.password });
      if (result.error) {
        setError(translateAuthError(result.error, "Adresse e-mail ou mot de passe incorrect."));
        return;
      }
      router.push("/decouvrir");
      router.refresh();
    } catch {
      setError("Connexion indisponible. Vérifiez votre configuration ou réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative" style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}>
        <div className="flex flex-col items-center justify-center w-full px-12 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 bg-white/10">
            <span className="text-white font-display font-bold text-3xl">AD</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-6">Content de vous revoir !</h2>
          <p className="text-white/70 leading-relaxed max-w-sm">Des personnes sincères vous attendent. Connectez-vous et poursuivez votre aventure.</p>
          <Image src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&h=300&fit=crop&auto=format" alt="Deux personnes partageant un moment au coucher du soleil" width={500} height={300} priority sizes="(max-width: 1024px) 0px, 30vw" className="rounded-2xl mt-10 w-full max-w-sm object-cover shadow-xl" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="auth-card p-6 sm:p-10">
            <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}>
                <span className="text-white font-display font-bold text-sm">AD</span>
              </div>
            </Link>
            <h1 className="font-display text-3xl font-bold text-[var(--color-midnight)] mb-2">Se connecter</h1>
            <p className="text-slate-500 text-sm mb-8">Bienvenue sur Amour Divin.</p>

            {error && <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Adresse e-mail</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Mot de passe</label>
                  <Link href="/mot-de-passe-oublie" className="text-xs text-[var(--color-lavender)] hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] focus:border-transparent transition-all pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Connexion...
                  </span>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Pas encore de compte ?{" "}
              <Link href="/inscription" className="text-[var(--color-lavender)] font-semibold hover:text-[var(--color-midnight)] transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
