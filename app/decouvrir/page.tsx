"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import ProfileCard from "@/components/shared/profile-card";
import { PROFILES } from "@/data/profiles";

export default function Discover() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ minAge: 18, maxAge: 50, city: "", distance: 100 });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = (id: string) => setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const filtered = PROFILES.filter(
    (p) =>
      (search === "" || p.firstName.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase())) &&
      p.age >= filters.minAge &&
      p.age <= filters.maxAge &&
      (filters.city === "" || p.city.toLowerCase().includes(filters.city.toLowerCase()))
  );

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

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
          <button
            onClick={handleSearch}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg, var(--color-midnight) 0%, var(--color-midnight-light) 100%)" }}
          >
            Rechercher
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-[var(--color-beige-dark)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Distance max : {filters.distance} km</label>
                <input type="range" min="10" max="500" value={filters.distance} onChange={(e) => setFilters((p) => ({ ...p, distance: +e.target.value }))} className="w-full accent-[var(--color-lavender)]" />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setFilters({ minAge: 18, maxAge: 50, city: "", distance: 100 })}
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
          <select className="text-sm border border-[var(--color-beige-dark)] rounded-lg px-3 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)]">
            <option>Trier : Dernière activité</option>
            <option>Trier : Profils vérifiés</option>
            <option>Trier : Proximité</option>
          </select>
        </div>

        {/* Grid */}
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
              <ProfileCard key={p.id} profile={p} onFavorite={toggleFavorite} isFavorite={favorites.includes(p.id)} />
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
                setFilters({ minAge: 18, maxAge: 50, city: "", distance: 100 });
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
