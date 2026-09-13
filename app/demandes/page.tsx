"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, X, Eye, Send } from "lucide-react";

import { PROFILES, unsplashUrl } from "@/data/profiles";

const RECEIVED = [
  { ...PROFILES[0], message: "Bonjour ! J'ai adoré votre profil. Votre foi et votre passion pour la vie me touchent beaucoup. J'aimerais vraiment échanger avec vous !" },
  { ...PROFILES[2], message: "Bonsoir, vos valeurs résonnent avec les miennes. J'espère que nous pourrons faire connaissance." },
  { ...PROFILES[4], message: "Votre profil est magnifique. Je serais ravie de discuter avec vous !" },
];

const SENT = [
  { ...PROFILES[1], status: "pending", message: "Bonjour Théo, j'ai vu que vous aimez la musique. Moi aussi ! J'espère avoir de vos nouvelles." },
  { ...PROFILES[3], status: "declined", message: "Votre foi et votre sérieux me touchent. J'aimerais vous connaître davantage." },
];

export default function Requests() {
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [received, setReceived] = useState(RECEIVED);
  const [sent, setSent] = useState(SENT);

  const accept = (id: string) => setReceived((prev) => prev.filter((r) => r.id !== id));
  const decline = (id: string) => setReceived((prev) => prev.filter((r) => r.id !== id));
  const cancel = (id: string) => setSent((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-[var(--color-midnight)]">Demandes</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[var(--color-beige)] p-1 rounded-2xl mb-8">
          <button
            onClick={() => setTab("received")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "received" ? "bg-white text-[var(--color-midnight)] shadow-sm" : "text-slate-500 hover:text-[var(--color-midnight)]"}`}
          >
            Reçues ({received.length})
          </button>
          <button
            onClick={() => setTab("sent")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "sent" ? "bg-white text-[var(--color-midnight)] shadow-sm" : "text-slate-500 hover:text-[var(--color-midnight)]"}`}
          >
            Envoyées ({sent.length})
          </button>
        </div>

        {/* Received */}
        {tab === "received" && (
          <div className="space-y-4">
            {received.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">💌</div>
                <h3 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-2">Aucune demande reçue</h3>
                <p className="text-slate-500 text-sm">Complétez votre profil pour être mieux découvert(e).</p>
              </div>
            ) : (
              received.map((r) => (
                <div key={r.id} className="bg-white rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-5">
                  <img src={unsplashUrl(r.photo, 80, 80)} alt={r.firstName} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display font-bold text-[var(--color-midnight)]">
                          {r.firstName}, {r.age}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {r.city} · {r.profession}
                        </p>
                      </div>
                      {r.verified && (
                        <div className="flex items-center gap-1 text-xs text-[var(--color-lavender)]">
                          <CheckCircle size={12} /> Vérifié
                        </div>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm italic mb-4">&quot;{r.message}&quot;</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => accept(r.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
                      >
                        <CheckCircle size={14} /> Accepter
                      </button>
                      <button onClick={() => decline(r.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-beige-dark)] text-slate-600 hover:bg-[var(--color-beige)] transition-colors">
                        <X size={14} /> Refuser
                      </button>
                      <Link href={`/profil/${r.id}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-lavender)] hover:bg-[var(--color-lavender-light)] transition-colors">
                        <Eye size={14} /> Voir le profil
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sent */}
        {tab === "sent" && (
          <div className="space-y-4">
            {sent.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">✉️</div>
                <h3 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-2">Aucune demande envoyée</h3>
                <p className="text-slate-500 text-sm mb-6">Découvrez des profils et envoyez votre première demande !</p>
                <Link
                  href="/decouvrir"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
                >
                  <Send size={15} /> Découvrir des profils
                </Link>
              </div>
            ) : (
              sent.map((r) => (
                <div key={r.id} className="bg-white rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-5">
                  <img src={unsplashUrl(r.photo, 80, 80)} alt={r.firstName} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-display font-bold text-[var(--color-midnight)]">
                          {r.firstName}, {r.age}
                        </h3>
                        <p className="text-slate-400 text-sm">{r.city}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${r.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"}`}>
                        {r.status === "pending" ? "En attente" : "Refusée"}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm italic mb-4">&quot;{r.message}&quot;</p>
                    <div className="flex gap-2">
                      <button onClick={() => cancel(r.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-beige-dark)] text-slate-600 hover:bg-[var(--color-beige)] transition-colors">
                        <X size={14} /> Annuler
                      </button>
                      <Link href={`/profil/${r.id}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[var(--color-lavender)] hover:bg-[var(--color-lavender-light)] transition-colors">
                        <Eye size={14} /> Voir le profil
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
