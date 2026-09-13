"use client";

import { useState } from "react";
import { Flag, CheckCircle, AlertTriangle } from "lucide-react";

const REASONS = ["Faux profil ou usurpation d'identité", "Comportement harcelant ou insistant", "Contenu offensant ou inapproprié", "Spam ou tentative d'escroquerie", "Profil d'une personne mineure", "Autre raison"];

export default function Report() {
  const [form, setForm] = useState({ target: "", reason: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-red-50 text-red-500">
            <Flag size={26} />
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-midnight)] mb-2">Signaler un profil</h1>
          <p className="text-slate-500 text-sm">Toutes les informations transmises sont traitées de façon confidentielle par notre équipe de modération.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-50">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--color-midnight)] mb-3">Signalement envoyé</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">Merci pour votre vigilance. Notre équipe va examiner votre signalement sous 24 heures.</p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ target: "", reason: "", description: "" });
                }}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
              >
                Envoyer un autre signalement
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Profil ou identifiant concerné</label>
                <input
                  type="text"
                  required
                  value={form.target}
                  onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all"
                  placeholder="Prénom, ville, ou lien du profil"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wide">Motif du signalement</label>
                <div className="space-y-2">
                  {REASONS.map((r) => (
                    <label key={r} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-[var(--color-beige)] transition-colors">
                      <input type="radio" name="reason" required checked={form.reason === r} onChange={() => setForm((p) => ({ ...p, reason: r }))} className="accent-[var(--color-midnight)]" />
                      <span className="text-sm text-slate-700">{r}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Décrivez la situation</label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all resize-none"
                  placeholder="Donnez-nous le plus de détails possible..."
                />
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700">En cas de danger immédiat, contactez directement les services d&apos;urgence de votre pays.</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm disabled:opacity-60 hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
              >
                {loading ? "Envoi en cours..." : "Envoyer le signalement"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
