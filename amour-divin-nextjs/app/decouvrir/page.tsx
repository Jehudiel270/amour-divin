"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import ProfileCard from "@/components/shared/profile-card";
import type { Profile } from "@/types";

export default function Discover() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ minAge: 18, maxAge: 70, city: "" });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([fetch("/api/profiles?limit=50"), fetch("/api/favorites")])
      .then(async ([profilesResponse, favoritesResponse]) => {
        const [profilesData, favoritesData] = await Promise.all([profilesResponse.json(), favoritesResponse.json()]);
        if (!profilesResponse.ok || !favoritesResponse.ok) throw new Error(profilesData.error || favoritesData.error);
        if (!active) return;
        setProfiles(profilesData.profiles);
        setFavorites(favoritesData.favorites.map((profile: Profile) => profile.id));
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Découverte indisponible.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const toggleFavorite = async (id: string) => {
    const isFavorite = favorites.includes(id);
    const response = await fetch("/api/favorites", {
      method: isFavorite ? "DELETE" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ targetUserId: id }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Impossible de mettre à jour le favori.");
      return;
    }
    setFavorites((current) => isFavorite ? current.filter((favorite) => favorite !== id) : [...current, id]);
  };

  const sendRequest = async (recipientId: string) => {
    const response = await fetch("/api/connection-requests", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ recipientId }),
    });
    const result = await response.json();
    if (!response.ok) setError(result.error || "Impossible d'envoyer la demande.");
  };

  const filtered = profiles.filter(
    (p) =>
      (search === "" || p.firstName.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase())) &&
      p.age >= filters.minAge &&
      p.age <= filters.maxAge &&
      (filters.city === "" || p.city.toLowerCase().includes(filters.city.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-[var(--color-midnight)] mb-2">Découvrir des profils</h1>
          <p className="text-slate-500 text-sm">Explorez des profils compatibles avec vos valeurs.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-beige-dark)] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all"
              placeholder="Rechercher par prénom ou ville..."
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border transition-all ${
              showFilters ? "border-[var(--color-lavender)] text-[var(--color-lavender)] bg-[var(--color-lavender-light)]" : "border-[var(--color-beige-dark)] text-slate-600 bg-white hover:border-[var(--color-lavender)]"
            }`}
          >
            <SlidersHorizontal size={16} /> Filtres
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-[var(--color-beige-dark)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Âge minimum : {filters.minAge}</label>
                <input type="range" min="18" max="60" value={filters.minAge} onChange={(e) => setFilters((p) => ({ ...p, minAge: +e.target.value }))} className="w-full accent-[var(--color-lavender)]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Âge maximum : {filters.maxAge}</label>
                <input type="range" min="18" max="70" value={filters.maxAge} onChange={(e) => setFilters((p) => ({ ...p, maxAge: +e.target.value }))} className="w-full accent-[var(--color-lavender)]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Ville</label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-beige-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all"
                  placeholder="Paris, Lyon..."
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setFilters({ minAge: 18, maxAge: 70, city: "" })}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={14} /> Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            {filtered.length} profil{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Grid */}
        {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                <div className="aspect-[4/5] bg-[var(--color-beige-dark)]"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[var(--color-beige-dark)] rounded w-2/3"></div>
                  <div className="h-3 bg-[var(--color-beige-dark)] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProfileCard key={p.id} profile={p} onFavorite={toggleFavorite} onRequest={sendRequest} isFavorite={favorites.includes(p.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-2">Aucun profil trouvé</h3>
            <p className="text-slate-500 text-sm">Essayez d&apos;élargir vos critères de recherche.</p>
            <button
              onClick={() => {
                setSearch("");
                setFilters({ minAge: 18, maxAge: 70, city: "" });
              }}
              className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium border border-[var(--color-beige-dark)] hover:bg-[var(--color-beige)] transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
