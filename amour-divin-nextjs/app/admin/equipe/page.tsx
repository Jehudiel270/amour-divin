"use client";

import { useEffect, useState } from "react";

import AdminLayout from "@/components/layout/admin-layout";

const ALL_PERMISSIONS = [
  ["dashboard", "Tableau de bord"],
  ["users", "Utilisateurs"],
  ["profiles", "Profils"],
  ["reports", "Signalements"],
  ["contact", "Contact"],
  ["billing", "Paiements"],
  ["content", "Contenu"],
] as const;

interface TeamMember {
  userId: string;
  firstName: string;
  role: "admin" | "super_admin";
  status: string;
  createdAt: string;
  permissions: string[];
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [role, setRole] = useState<"admin" | "super_admin">("admin");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const response = await fetch("/api/admin/team");
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Équipe indisponible.");
        if (active) setTeam(result.team);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Équipe indisponible.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const openMember = (member: TeamMember) => {
    setSelected(member);
    setRole(member.role);
    setPermissions(member.permissions);
  };

  const save = async () => {
    if (!selected) return;
    setError("");
    const response = await fetch("/api/admin/team", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: selected.userId, role, permissions }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Modification impossible.");
      return;
    }
    setTeam((current) => current.map((member) => member.userId === selected.userId ? { ...member, role, permissions } : member));
    setSelected(null);
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl px-8 py-10">
        <h1 className="mb-2 font-display text-2xl font-bold text-[var(--color-midnight)]">Équipe administrateur</h1>
        <p className="mb-6 text-sm text-slate-500">Réservé au super administrateur.</p>
        {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading ? <p className="py-10 text-center text-sm text-slate-400">Chargement...</p> : (
          <div className="space-y-3">
            {team.map((member) => (
              <button key={member.userId} onClick={() => openMember(member)} className="flex w-full items-center justify-between rounded-2xl bg-white p-5 text-left shadow-sm">
                <span><span className="block text-sm font-medium text-[var(--color-midnight)]">{member.firstName}</span><span className="text-xs text-slate-400">{member.userId}</span></span>
                <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: member.role === "super_admin" ? "var(--color-lavender-light)" : "#fef9ef", color: member.role === "super_admin" ? "var(--color-lavender)" : "#b7791f" }}>{member.role === "super_admin" ? "Super admin" : "Admin"}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="mb-5 font-display text-xl font-bold text-[var(--color-midnight)]">{selected.firstName}</h2>
            <label className="mb-5 block text-sm font-medium text-slate-700">Rôle
              <select value={role} onChange={(event) => setRole(event.target.value as "admin" | "super_admin")} className="mt-2 w-full rounded-xl border border-[var(--color-beige-dark)] px-4 py-3">
                <option value="admin">Admin</option>
                <option value="super_admin">Super admin</option>
              </select>
            </label>
            {role === "admin" && (
              <fieldset className="space-y-2">
                <legend className="mb-2 text-sm font-medium text-slate-700">Permissions</legend>
                {ALL_PERMISSIONS.map(([permission, label]) => (
                  <label key={permission} className="flex items-center gap-3 rounded-xl p-3 text-sm text-slate-600">
                    <input type="checkbox" checked={permissions.includes(permission)} onChange={(event) => setPermissions((current) => event.target.checked ? [...current, permission] : current.filter((item) => item !== permission))} />
                    {label}
                  </label>
                ))}
              </fieldset>
            )}
            {role === "super_admin" && <p className="rounded-xl bg-[var(--color-lavender-light)] p-3 text-sm text-slate-600">Accès complet à tous les modules.</p>}
            <button onClick={() => void save()} className="mt-6 w-full rounded-xl py-3 text-sm font-semibold text-white" style={{ background: "var(--color-midnight)" }}>Enregistrer</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
