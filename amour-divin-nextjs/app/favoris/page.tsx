"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Eye, X, CheckCircle } from "lucide-react";

import { unsplashUrl } from "@/data/profiles";
import type { Profile } from "@/types";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/favorites")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Favoris indisponibles.");
        if (active) setFavorites(result.favorites);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Favoris indisponibles.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const remove = async (id: string) => {
    const response = await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ targetUserId: id }),
    });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error || "Impossible de retirer ce favori.");
      return;
    }
    setFavorites((current) => current.filter((profile) => profile.id !== id));
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-[var(--color-midnight)]">Mes favoris</h1>
            <p className="text-slate-500 text-sm mt-1">
              {favorites.length} profil{favorites.length > 1 ? "s" : ""} enregistré{favorites.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-lavender-light)", color: "var(--color-lavender)" }}>
            <Heart size={20} />
          </div>
        </div>

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading ? (
          <div className="py-20 text-center text-sm text-slate-400">Chargement des favoris...</div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">💝</div>
            <h3 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-2">Aucun favori pour l&apos;instant</h3>
            <p className="text-slate-500 text-sm mb-8">Explorez des profils et ajoutez ceux qui vous touchent à vos favoris.</p>
            <Link
              href="/decouvrir"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
            >
              Découvrir des profils
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-beige)]">
                  <Image src={unsplashUrl(p.photo, 400, 300)} alt={`Photo de ${p.firstName}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  {p.verified && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <CheckCircle size={11} className="text-[var(--color-lavender)]" />
                      <span className="text-xs font-medium text-[var(--color-midnight)]">Vérifié</span>
                    </div>
                  )}
                  <button
                    onClick={() => remove(p.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-400 hover:bg-red-50 transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display font-bold text-lg text-[var(--color-midnight)]">
                        {p.firstName}, {p.age}
                      </h3>
                      <p className="text-slate-500 text-sm">
                        {p.city} · {p.profession}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/profil/${p.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border border-[var(--color-beige-dark)] text-[var(--color-midnight)] hover:bg-[var(--color-beige)] transition-colors"
                    >
                      <Eye size={14} /> Voir le profil
                    </Link>
                    <button onClick={() => remove(p.id)} className="flex items-center justify-center w-10 h-10 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors">
                      <Heart size={15} fill="currentColor" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
