"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";

type ReportStatus = "pending" | "reviewing" | "resolved" | "dismissed";
interface AdminReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetUserId: string;
  reason: string;
  details: string;
  status: ReportStatus;
  createdAt: string;
}

const STATUS_LABEL: Record<ReportStatus, { label: string; classes: string }> = {
  pending: { label: "En attente", classes: "bg-amber-50 text-amber-600" },
  reviewing: { label: "En cours", classes: "bg-blue-50 text-blue-600" },
  resolved: { label: "Résolu", classes: "bg-green-50 text-green-600" },
  dismissed: { label: "Classé", classes: "bg-slate-100 text-slate-500" },
};

export default function AdminReports() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [selected, setSelected] = useState<AdminReport | null>(null);
  const [tab, setTab] = useState<ReportStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/reports")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Signalements indisponibles.");
        if (active) setReports(result.reports);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Signalements indisponibles.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateReport = async (id: string, status: "reviewing" | "resolved" | "dismissed") => {
    const response = await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reportId: id, status }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Décision non enregistrée.");
      return;
    }
    setReports((current) => current.map((report) => report.id === id ? { ...report, status } : report));
    setSelected(null);
  };

  const filtered = tab === "all" ? reports : reports.filter((r) => r.status === tab);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="font-display text-2xl font-bold text-[var(--color-midnight)] mb-1">Signalements</h1>
        <p className="text-slate-500 text-sm mb-6">Modération des profils et comportements signalés.</p>

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="flex gap-1 bg-white p-1 rounded-xl mb-6 w-fit shadow-sm">
          {(["all", "pending", "reviewing", "resolved", "dismissed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "text-white" : "text-slate-500 hover:text-[var(--color-midnight)]"}`}
              style={tab === t ? { background: "var(--color-midnight)" } : {}}
            >
              {t === "all" ? "Tous" : STATUS_LABEL[t].label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {loading && <p className="p-8 text-center text-sm text-slate-400">Chargement...</p>}
          {!loading && filtered.length === 0 && <p className="p-8 text-center text-sm text-slate-400">Aucun signalement dans cette catégorie.</p>}
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm text-[var(--color-midnight)]">{r.targetUserId}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_LABEL[r.status].classes}`}>{STATUS_LABEL[r.status].label}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {r.reason} · Signalé par {r.reporterName} · {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setSelected(r)} className="px-4 py-2 rounded-lg text-xs font-medium border border-[var(--color-beige-dark)] text-slate-600 hover:bg-[var(--color-beige)] transition-colors">
                  Détails
                </button>
                {r.status !== "resolved" && r.status !== "dismissed" && (
                  <button onClick={() => void updateReport(r.id, "resolved")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-all" style={{ background: "var(--color-midnight)" }}>
                    <CheckCircle2 size={13} /> Résoudre
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-[var(--color-midnight)]">Signalement {selected.id}</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Signalé par</p>
                <p className="text-[var(--color-midnight)]">
                  {selected.reporterName} ({selected.reporterId})
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Profil concerné</p>
                <p className="text-[var(--color-midnight)]">{selected.targetUserId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Motif</p>
                <p className="text-[var(--color-midnight)]">{selected.reason}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Description</p>
                <p className="text-slate-600 leading-relaxed">{selected.details}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Date</p>
                <p className="text-slate-600">{new Date(selected.createdAt).toLocaleString("fr-FR")}</p>
              </div>
            </div>
            {selected.status !== "resolved" && selected.status !== "dismissed" && (
              <button onClick={() => void updateReport(selected.id, "resolved")} className="w-full mt-6 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ background: "var(--color-midnight)" }}>
                Marquer comme résolu
              </button>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
