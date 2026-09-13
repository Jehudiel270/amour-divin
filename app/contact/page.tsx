"use client";

import { useState } from "react";
import { Mail, MessageSquare, CheckCircle, MapPin, Clock } from "lucide-react";

import Footer from "@/components/shared/footer";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
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
      <section className="py-20" style={{ background: "var(--color-beige)" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
            <MessageSquare size={26} />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--color-midnight)] mb-4">Contactez-nous</h1>
          <p className="text-slate-600">Une question, une suggestion ? Notre équipe vous répond sous 48 heures.</p>
        </div>
      </section>

      <section className="py-16 bg-[var(--color-cream)]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-50">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h2 className="font-display text-2xl font-bold text-[var(--color-midnight)] mb-3">Message envoyé !</h2>
                <p className="text-slate-500 text-sm">Merci de nous avoir contactés. Nous reviendrons vers vous rapidement.</p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Nom</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">E-mail</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all"
                      placeholder="vous@exemple.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Sujet</label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option>Question sur mon compte</option>
                    <option>Problème technique</option>
                    <option>Signalement</option>
                    <option>Partenariat</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all resize-none"
                    placeholder="Décrivez votre demande..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm disabled:opacity-60 hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
                >
                  {loading ? "Envoi..." : "Envoyer le message"}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <Mail size={20} className="text-[var(--color-lavender)] mb-3" />
              <h3 className="font-semibold text-sm text-[var(--color-midnight)] mb-1">E-mail</h3>
              <p className="text-sm text-slate-500">contact@amourdivin.fr</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <Clock size={20} className="text-[var(--color-lavender)] mb-3" />
              <h3 className="font-semibold text-sm text-[var(--color-midnight)] mb-1">Temps de réponse</h3>
              <p className="text-sm text-slate-500">Sous 48 heures ouvrées</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <MapPin size={20} className="text-[var(--color-lavender)] mb-3" />
              <h3 className="font-semibold text-sm text-[var(--color-midnight)] mb-1">Siège</h3>
              <p className="text-sm text-slate-500">Paris, France</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
