"use client";

import { useEffect, useState } from "react";
import { Check, X, ShieldCheck } from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";

interface PendingProfile {
  id: string;
  firstName: string;
  birthDate: string;
  city: string;
  profession: string;
  bio: string;
  photoUrl: string | null;
  photoStatus: string | null;
}

import Image from "next/image";
export default function AdminVerifications() {
  const [items, setItems] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const response = await fetch("/api/admin/profiles");
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "File de modération indisponible.");
        if (active) {
          setItems(result.profiles);
          setError("");
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "File de modération indisponible.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handle = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    setError("");
    try {
      const response = await fetch("/api/admin/profiles", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: id, action }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Décision non enregistrée.");
      setItems((current) => current.filter((profile) => profile.id !== id));
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Décision non enregistrée.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="font-display text-2xl font-bold text-[var(--color-midnight)] mb-1">Vérifications</h1>
        <p className="text-slate-500 text-sm mb-6">Examinez les demandes de vérification de profil des membres.</p>

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-400">Chargement...</div>
        ) : items.length === 0 ? (
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
                  {v.photoUrl ? <Image src={v.photoUrl} alt={`Photo de ${v.firstName}`} width={56} height={56} className="h-14 w-14 rounded-xl object-cover" /> : <div aria-label="Photo absente" className="h-14 w-14 rounded-xl bg-slate-100" />}
                  <div>
                    <p className="font-medium text-[var(--color-midnight)]">
                      {v.firstName}, {new Date().getFullYear() - new Date(v.birthDate).getFullYear()} ans
                    </p>
                    <p className="text-xs text-slate-400">{v.city}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Photo : {v.photoStatus ?? "absente"}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button disabled={busyId === v.id} onClick={() => void handle(v.id, "reject")} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium border border-[var(--color-beige-dark)] text-slate-600 hover:bg-[var(--color-beige)] transition-colors disabled:opacity-50">
                    <X size={13} /> Rejeter
                  </button>
                  <button disabled={busyId === v.id} onClick={() => void handle(v.id, "approve")} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-all disabled:opacity-50" style={{ background: "var(--color-midnight)" }}>
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
