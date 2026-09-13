import Link from "next/link";
import { MessageCircle, Eye, Heart } from "lucide-react";

import { PROFILES, unsplashUrl } from "@/data/profiles";

const MATCHES = PROFILES.slice(0, 5).map((p, i) => ({ ...p, matchedAt: ["Aujourd'hui", "Hier", "Il y a 3 jours", "Il y a 5 jours", "Il y a 1 semaine"][i] }));

export default function Matches() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
            <Heart size={20} />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-[var(--color-midnight)]">Mes matchs</h1>
            <p className="text-slate-500 text-sm">
              {MATCHES.length} connexion{MATCHES.length > 1 ? "s" : ""} établie{MATCHES.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {MATCHES.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">💝</div>
            <h3 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-2">Pas encore de match</h3>
            <p className="text-slate-500 text-sm mb-6">Envoyez des demandes à des profils qui vous touchent !</p>
            <Link
              href="/decouvrir"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
            >
              Découvrir des profils
            </Link>
          </div>
        ) : (
          <>
            {/* New match highlight */}
            <div className="mb-8 p-1 rounded-3xl" style={{ background: "linear-gradient(135deg, var(--color-lavender) 0%, var(--color-gold) 100%)" }}>
              <div className="bg-white rounded-3xl p-6 flex items-center gap-5">
                <div className="relative">
                  <img src={unsplashUrl(MATCHES[0].photo, 80, 80)} alt={MATCHES[0].firstName} className="w-16 h-16 rounded-2xl object-cover" />
                  <span className="absolute -top-1 -right-1 text-lg">💝</span>
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-[var(--color-lavender)] uppercase tracking-widest">Nouveau match !</span>
                  <h3 className="font-display font-bold text-xl text-[var(--color-midnight)]">
                    {MATCHES[0].firstName}, {MATCHES[0].age}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {MATCHES[0].city} · Matché {MATCHES[0].matchedAt}
                  </p>
                </div>
                <Link
                  href="/messages"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
                >
                  <MessageCircle size={15} /> Message
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {MATCHES.slice(1).map((m) => (
                <div key={m.id} className="bg-white rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:shadow-md transition-shadow">
                  <img src={unsplashUrl(m.photo, 80, 80)} alt={m.firstName} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg text-[var(--color-midnight)]">
                      {m.firstName}, {m.age}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {m.city} · {m.profession}
                    </p>
                    <p className="text-xs text-slate-300 mt-1">Matché {m.matchedAt}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link
                      href="/messages"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
                      style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
                    >
                      <MessageCircle size={14} /> Message
                    </Link>
                    <Link href={`/profil/${m.id}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-[var(--color-beige-dark)] text-slate-600 hover:bg-[var(--color-beige)] transition-colors">
                      <Eye size={14} /> Profil
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
