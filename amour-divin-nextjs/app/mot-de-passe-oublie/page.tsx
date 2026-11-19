"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { translateAuthError } from "@/lib/auth/messages";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
      });
      if (result.error) throw new Error(translateAuthError(result.error, "Demande de réinitialisation impossible."));
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Demande de réinitialisation indisponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--color-beige)" }}>
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}>
            <span className="text-white font-display font-bold">AD</span>
          </div>
          <span className="font-display font-semibold text-xl text-[var(--color-midnight)]">Amour Divin</span>
        </Link>

        <div className="bg-white rounded-3xl p-10 shadow-sm">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-50">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--color-midnight)] mb-3">E-mail envoyé !</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Si un compte existe avec <strong>{email}</strong>, vous recevrez un e-mail avec un lien pour réinitialiser votre mot de passe dans quelques minutes.
              </p>
              <p className="text-xs text-slate-400 mb-6">Vérifiez aussi vos courriers indésirables (spam).</p>
              <Link
                href="/connexion"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
              >
                Retour à la connexion <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
                <Mail size={26} />
              </div>
              <h1 className="font-display text-3xl font-bold text-[var(--color-midnight)] mb-2">Mot de passe oublié ?</h1>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Pas de panique ! Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Adresse e-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] focus:border-transparent transition-all"
                    placeholder="votre@email.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Envoi...
                    </span>
                  ) : (
                    <>
                      <span>Envoyer le lien</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                <Link href="/connexion" className="text-[var(--color-lavender)] hover:text-[var(--color-midnight)] transition-colors">
                  ← Retour à la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
