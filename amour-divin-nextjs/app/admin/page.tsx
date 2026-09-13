"use client";

import { Flag, ShieldCheck, TrendingUp, Users } from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";
import { ADMIN_STATS, RECENT_USERS, RECENT_REPORTS_SUMMARY } from "@/data/admin";

const STATUS_LABEL: Record<string, { label: string; classes: string }> = {
  verified: { label: "Vérifié", classes: "bg-green-50 text-green-600" },
  pending: { label: "En attente", classes: "bg-amber-50 text-amber-600" },
  suspended: { label: "Suspendu", classes: "bg-red-50 text-red-500" },
  urgent: { label: "Urgent", classes: "bg-red-50 text-red-500" },
  resolved: { label: "Résolu", classes: "bg-green-50 text-green-600" },
};

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-8 py-10">
        <h1 className="font-display text-2xl font-bold text-[var(--color-midnight)] mb-1">Tableau de bord</h1>
        <p className="text-slate-500 text-sm mb-8">Vue d&apos;ensemble de l&apos;activité de la plateforme.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {ADMIN_STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs text-slate-400 mb-1">{s.label}</p>
              <p className="font-display text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-xs text-slate-400 mt-1">{s.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Users size={17} className="text-[var(--color-lavender)]" />
              <h2 className="font-semibold text-[var(--color-midnight)]">Utilisateurs récents</h2>
            </div>
            <div className="divide-y divide-[var(--color-beige-dark)]">
              {RECENT_USERS.map((u) => (
                <div key={u.email} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-midnight)]">{u.name}</p>
                    <p className="text-xs text-slate-400">
                      {u.city} · {u.date}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_LABEL[u.status].classes}`}>{STATUS_LABEL[u.status].label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Flag size={17} className="text-red-400" />
              <h2 className="font-semibold text-[var(--color-midnight)]">Signalements récents</h2>
            </div>
            <div className="divide-y divide-[var(--color-beige-dark)]">
              {RECENT_REPORTS_SUMMARY.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-midnight)]">{r.target}</p>
                    <p className="text-xs text-slate-400">
                      {r.reason} · {r.date}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_LABEL[r.status].classes}`}>{STATUS_LABEL[r.status].label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={17} className="text-[var(--color-lavender)]" />
            <h2 className="font-semibold text-[var(--color-midnight)]">Activité de la semaine</h2>
          </div>
          <div className="flex items-end gap-3 h-40">
            {[62, 78, 55, 90, 70, 85, 95].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg" style={{ height: `${v}%`, background: "var(--color-lavender-light)" }}>
                  <div className="w-full h-full rounded-t-lg" style={{ background: "var(--color-lavender)", opacity: 0.5 + i * 0.05 }}></div>
                </div>
                <span className="text-xs text-slate-400">{["L", "M", "M", "J", "V", "S", "D"][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={13} /> Données fictives à des fins de démonstration.
        </div>
      </div>
    </AdminLayout>
  );
}
