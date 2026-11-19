"use client";

import { useState } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth/client";
import { translateAuthError } from "@/lib/auth/messages";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (!token) {
      setError("Le lien de réinitialisation est invalide ou expiré.");
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setError("Le mot de passe doit contenir entre 8 et 128 caractères.");
      return;
    }
    if (password !== confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.resetPassword({ newPassword: password, token });
      if (result.error) throw new Error(translateAuthError(result.error, "Réinitialisation impossible."));
      setSuccess(true);
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Réinitialisation indisponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-20">
      <div className="w-full rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 font-display text-2xl font-bold text-[var(--color-midnight)]">Nouveau mot de passe</h1>
        {success ? (
          <div>
            <p className="mb-6 text-sm text-green-700">Votre mot de passe a été modifié. Vous pouvez vous connecter.</p>
            <Link href="/connexion" className="font-semibold text-[var(--color-lavender)]">Aller à la connexion</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <p className="text-sm text-slate-500">Choisissez un nouveau mot de passe pour votre compte.</p>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <label className="block text-sm font-medium text-slate-700">
              Nouveau mot de passe
              <input type="password" required minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--color-beige-dark)] px-4 py-3" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Confirmer le mot de passe
              <input type="password" required minLength={8} maxLength={128} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--color-beige-dark)] px-4 py-3" />
            </label>
            <button type="submit" disabled={loading} className="w-full rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:opacity-50" style={{ background: "var(--color-midnight)" }}>
              {loading ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
