"use client";

import { useState } from "react";
import { Check, X, ShieldCheck } from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { PROFILES, unsplashUrl } from "@/data/profiles";

const PENDING = PROFILES.filter((p) => !p.verified).map((p) => ({ ...p, submittedAt: "Il y a 4 heures" }));

export default function AdminVerifications() {
  const [items, setItems] = useState(PENDING);

  const handle = (id: string) => setItems((prev) => prev.filter((v) => v.id !== id));

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="font-display text-2xl font-bold text-[var(--color-midnight)] mb-1">Vérifications</h1>
        <p className="text-slate-500 text-sm mb-6">Examinez les demandes de vérification de profil des membres.</p>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <ShieldCheck size={36} className="text-slate-200 mx-auto mb-4" />
            <p className="font-medium text-[var(--color-midnight)]">Aucune vérification en attente</p>
            <p className="text-sm text-slate-400 mt-1">Toutes les demandes ont été traitées.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((v) => (
              <div key={v.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <img src={unsplashUrl(v.photo, 120, 120)} alt={v.firstName} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <p className="font-medium text-[var(--color-midnight)]">
                      {v.firstName}, {v.age} ans
                    </p>
                    <p className="text-xs text-slate-400">{v.city}</p>
                    <p className="text-xs text-slate-300 mt-0.5">Soumis {v.submittedAt}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handle(v.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border border-[var(--color-beige-dark)] text-slate-600 hover:bg-[var(--color-beige)] transition-colors">
                    <X size={13} /> Rejeter
                  </button>
                  <button onClick={() => handle(v.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-all" style={{ background: "var(--color-midnight)" }}>
                    <Check size={13} /> Valider
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
