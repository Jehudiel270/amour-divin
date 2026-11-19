"use client";

import { useEffect, useState } from "react";
import { Flag, ShieldCheck, TrendingUp, Users } from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";

interface DashboardData {
  stats: Array<{ label: string; value: number; change: string }>;
  recentUsers: Array<{ id: string; name: string; city: string; status: string; createdAt: string }>;
  recentReports: Array<{ id: string; targetUserId: string; reason: string; status: string; createdAt: string }>;
  activity: Array<{ day: string; members: number }>;
}

const STATUS_LABEL: Record<string, { label: string; classes: string }> = {
  active: { label: "Actif", classes: "bg-green-50 text-green-600" },
  pending: { label: "En attente", classes: "bg-amber-50 text-amber-600" },
  suspended: { label: "Suspendu", classes: "bg-red-50 text-red-500" },
  reviewing: { label: "En cours", classes: "bg-blue-50 text-blue-600" },
  resolved: { label: "Résolu", classes: "bg-green-50 text-green-600" },
  dismissed: { label: "Classé", classes: "bg-slate-100 text-slate-500" },
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/stats")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Tableau de bord indisponible.");
        if (active) setData(result);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Tableau de bord indisponible.");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl px-8 py-10">
        <h1 className="mb-1 font-display text-2xl font-bold text-[var(--color-midnight)]">Tableau de bord</h1>
        <p className="mb-8 text-sm text-slate-500">Vue d&apos;ensemble de l&apos;activité de la plateforme.</p>
        {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(data?.stats ?? []).map((stat, index) => {
            const Icon = [Users, TrendingUp, Flag, ShieldCheck][index];
            return (
              <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between text-slate-400"><span className="text-xs">{stat.label}</span><Icon size={17} /></div>
                <p className="font-display text-2xl font-bold text-[var(--color-midnight)]">{stat.value.toLocaleString("fr-FR")}</p>
                <p className="mt-1 text-xs text-slate-400">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {!data && !error && <p className="py-10 text-center text-sm text-slate-400">Chargement des statistiques...</p>}
        {data && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-5 flex items-center gap-2 font-semibold text-[var(--color-midnight)]"><Users size={17} /> Membres récents</h2>
                <div className="divide-y divide-[var(--color-beige-dark)]">
                  {data.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-3 py-3">
                      <div><p className="text-sm font-medium text-[var(--color-midnight)]">{user.name}</p><p className="text-xs text-slate-400">{user.city || "Ville non renseignée"} · {new Date(user.createdAt).toLocaleDateString("fr-FR")}</p></div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_LABEL[user.status]?.classes ?? "bg-slate-100 text-slate-500"}`}>{STATUS_LABEL[user.status]?.label ?? user.status}</span>
                    </div>
                  ))}
                  {data.recentUsers.length === 0 && <p className="py-5 text-sm text-slate-400">Aucun membre enregistré.</p>}
                </div>
              </section>

              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-5 flex items-center gap-2 font-semibold text-[var(--color-midnight)]"><Flag size={17} /> Signalements récents</h2>
                <div className="divide-y divide-[var(--color-beige-dark)]">
                  {data.recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between gap-3 py-3">
                      <div><p className="text-sm font-medium text-[var(--color-midnight)]">{report.targetUserId}</p><p className="text-xs text-slate-400">{report.reason} · {new Date(report.createdAt).toLocaleDateString("fr-FR")}</p></div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_LABEL[report.status]?.classes ?? "bg-slate-100 text-slate-500"}`}>{STATUS_LABEL[report.status]?.label ?? report.status}</span>
                    </div>
                  ))}
                  {data.recentReports.length === 0 && <p className="py-5 text-sm text-slate-400">Aucun signalement enregistré.</p>}
                </div>
              </section>
            </div>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 font-semibold text-[var(--color-midnight)]"><TrendingUp size={17} /> Inscriptions (7 jours)</h2>
              {data.activity.length === 0 ? <p className="text-sm text-slate-400">Pas encore d&apos;activité enregistrée.</p> : (
                <div className="flex h-40 items-end gap-3">
                  {data.activity.map((day) => <div key={day.day} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-[var(--color-lavender)]" style={{ height: `${Math.max(8, day.members * 20)}%` }} /><span className="text-xs text-slate-400">{new Date(day.day).toLocaleDateString("fr-FR", { weekday: "short" })}</span></div>)}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
