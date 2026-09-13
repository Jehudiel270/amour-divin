"use client";

import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { ADMIN_REPORTS } from "@/data/admin";
import type { AdminReport, AdminReportStatus } from "@/types";

const STATUS_LABEL: Record<AdminReportStatus, { label: string; classes: string }> = {
  urgent: { label: "Urgent", classes: "bg-red-50 text-red-500" },
  pending: { label: "En attente", classes: "bg-amber-50 text-amber-600" },
  resolved: { label: "Résolu", classes: "bg-green-50 text-green-600" },
};

export default function AdminReports() {
  const [reports, setReports] = useState(ADMIN_REPORTS);
  const [selected, setSelected] = useState<AdminReport | null>(null);
  const [tab, setTab] = useState<AdminReportStatus | "all">("all");

  const resolve = (id: string) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "resolved" as const } : r)));
    setSelected(null);
  };

  const filtered = tab === "all" ? reports : reports.filter((r) => r.status === tab);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="font-display text-2xl font-bold text-[var(--color-midnight)] mb-1">Signalements</h1>
        <p className="text-slate-500 text-sm mb-6">Modération des profils et comportements signalés.</p>

        <div className="flex gap-1 bg-white p-1 rounded-xl mb-6 w-fit shadow-sm">
          {(["all", "urgent", "pending", "resolved"] as const).map((t) => (
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
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm text-[var(--color-midnight)]">{r.target}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_LABEL[r.status].classes}`}>{STATUS_LABEL[r.status].label}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {r.reason} · Signalé par {r.reporter} · {r.date}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setSelected(r)} className="px-4 py-2 rounded-lg text-xs font-medium border border-[var(--color-beige-dark)] text-slate-600 hover:bg-[var(--color-beige)] transition-colors">
                  Détails
                </button>
                {r.status !== "resolved" && (
                  <button onClick={() => resolve(r.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-all" style={{ background: "var(--color-midnight)" }}>
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
                  {selected.reporter} ({selected.reporterEmail})
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Profil concerné</p>
                <p className="text-[var(--color-midnight)]">{selected.target}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Motif</p>
                <p className="text-[var(--color-midnight)]">{selected.reason}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Description</p>
                <p className="text-slate-600 leading-relaxed">{selected.desc}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Date</p>
                <p className="text-slate-600">{selected.date}</p>
              </div>
            </div>
            {selected.status !== "resolved" && (
              <button onClick={() => resolve(selected.id)} className="w-full mt-6 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ background: "var(--color-midnight)" }}>
                Marquer comme résolu
              </button>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
