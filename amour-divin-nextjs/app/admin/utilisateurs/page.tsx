"use client";

import { useEffect, useState } from "react";
import { Search, MoreVertical, CheckCircle } from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";

type UserStatus = "active" | "pending" | "suspended" | "draft" | "deleted";
interface AdminUser {
  id: string;
  name: string;
  city: string;
  age: number;
  status: UserStatus;
  createdAt: string;
}

const STATUS_LABEL: Record<UserStatus, { label: string; classes: string }> = {
  active: { label: "Actif", classes: "bg-green-50 text-green-600" },
  pending: { label: "En attente", classes: "bg-amber-50 text-amber-600" },
  suspended: { label: "Suspendu", classes: "bg-red-50 text-red-500" },
  draft: { label: "Brouillon", classes: "bg-slate-100 text-slate-500" },
  deleted: { label: "Supprimé", classes: "bg-slate-100 text-slate-500" },
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/users")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Utilisateurs indisponibles.");
        if (active) setUsers(result.users);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Utilisateurs indisponibles.");
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.city.toLowerCase().includes(search.toLowerCase()));

  const setStatus = async (id: string, status: "active" | "suspended" | "pending") => {
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: id, status }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Statut non modifié.");
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    setOpenMenu(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-8 py-10">
        <h1 className="font-display text-2xl font-bold text-[var(--color-midnight)] mb-1">Utilisateurs</h1>
        <p className="text-slate-500 text-sm mb-6">{users.length} membres inscrits sur la plateforme.</p>
        {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="relative mb-6 max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un membre..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--color-beige-dark)] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)] transition-all"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-beige)] text-left text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Membre</th>
                <th className="px-5 py-3 font-medium">Ville</th>
                <th className="px-5 py-3 font-medium">Inscrit le</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-beige-dark)]">
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 font-medium text-[var(--color-midnight)]">
                      {u.name}
                      {u.status === "active" && <CheckCircle size={12} className="text-[var(--color-lavender)]" />}
                    </div>
                    <div className="text-xs text-slate-400">{u.id}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {u.city} · {u.age} ans
                  </td>
                  <td className="px-5 py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_LABEL[u.status].classes}`}>{STATUS_LABEL[u.status].label}</span>
                  </td>
                  <td className="px-5 py-3 text-right relative">
                    <button onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-[var(--color-beige)] hover:text-[var(--color-midnight)]">
                      <MoreVertical size={16} />
                    </button>
                    {openMenu === u.id && (
                      <div className="absolute right-5 top-10 z-10 w-44 bg-white rounded-xl shadow-lg border border-[var(--color-beige-dark)] py-1">
                        <button onClick={() => void setStatus(u.id, "active")} className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-[var(--color-beige)]">
                          Réactiver le compte
                        </button>
                        <button onClick={() => void setStatus(u.id, "suspended")} className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50">
                          Suspendre le compte
                        </button>
                        <button onClick={() => void setStatus(u.id, "pending")} className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-[var(--color-beige)]">
                          Réinitialiser le statut
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
