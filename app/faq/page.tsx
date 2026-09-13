"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

import Footer from "@/components/shared/footer";

const CATEGORIES = [
  {
    title: "Général",
    items: [
      { q: "AD est-il réservé aux chrétiens ?", a: "Oui, AD est conçu pour des jeunes adultes qui souhaitent fonder une relation sur des valeurs chrétiennes partagées, quelle que soit leur dénomination." },
      { q: "Quel est l'âge minimum pour s'inscrire ?", a: "AD est strictement réservé aux personnes de 18 ans et plus. Une confirmation d'âge est demandée à l'inscription." },
      { q: "Dans quels pays AD est-il disponible ?", a: "AD est actuellement disponible en France, en Belgique et en Suisse francophone, avec une extension prévue vers d'autres pays." },
    ],
  },
  {
    title: "Compte & Profil",
    items: [
      { q: "Comment fonctionne la vérification des profils ?", a: "Chaque profil est examiné par notre équipe de modération avant publication. Vous pouvez aussi vérifier votre identité pour obtenir le badge vérifié." },
      { q: "Puis-je modifier mon profil après publication ?", a: "Oui, vous pouvez modifier vos photos, votre présentation et vos préférences à tout moment depuis les réglages." },
      { q: "Comment supprimer mon compte ?", a: "Rendez-vous dans Réglages > Mon profil > Supprimer mon compte. Cette action est définitive." },
    ],
  },
  {
    title: "Rencontres & Sécurité",
    items: [
      { q: "Comment envoyer une demande de connexion ?", a: "Depuis un profil qui vous intéresse, cliquez sur \"Envoyer une demande\". Un message personnalisé augmente vos chances d'acceptation." },
      { q: "Comment signaler un comportement inapproprié ?", a: "Chaque profil dispose d'un bouton \"Signaler\". Notre équipe traite tous les signalements sous 24h." },
      { q: "Quelles précautions prendre pour une première rencontre ?", a: "Privilégiez un lieu public, informez un proche, et prenez le temps de bien connaître la personne au préalable." },
    ],
  },
  {
    title: "Abonnement",
    items: [
      { q: "Est-ce gratuit ?", a: "L'inscription et la découverte de profils sont gratuites. Certaines fonctionnalités avancées sont disponibles avec un abonnement Premium." },
      { q: "Que propose l'abonnement Premium ?", a: "Demandes illimitées, visibilité de qui a consulté votre profil, mise en avant et filtres de recherche avancés." },
      { q: "Puis-je annuler mon abonnement à tout moment ?", a: "Oui, vous pouvez annuler à tout moment depuis Réglages > Abonnement, sans engagement." },
    ],
  },
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((i) => i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase())),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <section className="py-20" style={{ background: "var(--color-beige)" }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
            <HelpCircle size={26} />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--color-midnight)] mb-6">Questions fréquentes</h1>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une question..."
            className="w-full px-5 py-3.5 rounded-xl border border-[var(--color-beige-dark)] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all"
          />
        </div>
      </section>

      <section className="py-16 bg-[var(--color-cream)]">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400">Aucune question ne correspond à votre recherche.</p>
          ) : (
            filtered.map((cat) => (
              <div key={cat.title}>
                <h2 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-4">{cat.title}</h2>
                <div className="space-y-3">
                  {cat.items.map((item) => {
                    const id = cat.title + item.q;
                    const isOpen = openItem === id;
                    return (
                      <div key={id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <button onClick={() => setOpenItem(isOpen ? null : id)} className="w-full flex items-center justify-between p-5 text-left">
                          <span className="font-medium text-sm text-[var(--color-midnight)] pr-4">{item.q}</span>
                          <ChevronDown size={18} className={`text-[var(--color-lavender)] transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isOpen && <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{item.a}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
