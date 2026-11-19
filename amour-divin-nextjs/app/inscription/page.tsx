"use client";

import { useState } from "react";
import Link from "next/link";
import { useTransition } from "react";
import { Eye, EyeOff, CheckCircle, ArrowRight } from "lucide-react";

import { registerWithEmail } from "@/app/inscription/actions";

export default function Register() {
  const [form, setForm] = useState({ firstName: "", email: "", password: "", birthDate: "", ageConfirm: false, terms: false });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    startTransition(async () => {
      const result = await registerWithEmail(formData);
      if (result.error) setError(result.error);
      else setSuccess(result.success ?? "");
    });
  };

  return (
    <div className="auth-shell min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center" style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}>
        <div className="relative z-10 max-w-md text-center px-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-white/10">
            <span className="text-white font-display font-bold text-2xl">AD</span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-6">Bienvenue dans la communauté AD</h2>
          <p className="text-white/70 leading-relaxed mb-10">Créez votre profil et partagez les valeurs qui comptent pour vous.</p>
          <div className="space-y-4">
            {["Revue des profils avant publication", "Contrôle de visibilité du profil", "Communauté fondée sur le respect", "Accès de base gratuit"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-left">
                <CheckCircle size={18} className="text-[var(--color-gold-light)] flex-shrink-0" />
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="auth-card p-6 sm:p-10">
            <div className="mb-8">
              <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}>
                  <span className="text-white font-display font-bold text-sm">AD</span>
                </div>
                <span className="font-display font-semibold text-[var(--color-midnight)]">Amour Divin</span>
              </Link>
              <h1 className="font-display text-3xl font-bold text-[var(--color-midnight)]">Créer un compte</h1>
              <p className="text-slate-500 text-sm mt-2">Rejoignez une communauté sincère et bienveillante.</p>
            </div>

            {error && <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>}
            {success && <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-100 text-sm text-green-700">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Prénom</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] focus:border-transparent transition-all"
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Adresse e-mail</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] focus:border-transparent transition-all"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Mot de passe</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPwd ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] focus:border-transparent transition-all pr-10"
                    placeholder="8 caractères minimum"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Date de naissance</label>
                <input
                  name="birthDate"
                  type="date"
                  required
                  value={form.birthDate}
                  onChange={(e) => setForm((p) => ({ ...p, birthDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    name="ageConfirm"
                    type="checkbox"
                    checked={form.ageConfirm}
                    onChange={(e) => setForm((p) => ({ ...p, ageConfirm: e.target.checked }))}
                    className="mt-0.5 rounded accent-[var(--color-midnight)]"
                  />
                  <span className="text-sm text-slate-600">
                    Je confirme avoir <strong>18 ans ou plus</strong> et que les informations fournies sont exactes.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    name="terms"
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => setForm((p) => ({ ...p, terms: e.target.checked }))}
                    className="mt-0.5 rounded accent-[var(--color-midnight)]"
                  />
                  <span className="text-sm text-slate-600">
                    J&apos;accepte les{" "}
                    <Link href="/conditions" className="text-[var(--color-lavender)] hover:underline">
                      conditions d&apos;utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link href="/confidentialite" className="text-[var(--color-lavender)] hover:underline">
                      politique de confidentialité
                    </Link>
                    .
                  </span>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Création du compte...
                  </span>
                ) : (
                  <>
                    <span>Créer mon compte</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Déjà un compte ?{" "}
              <Link href="/connexion" className="text-[var(--color-lavender)] font-semibold hover:text-[var(--color-midnight)] transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
