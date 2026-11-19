"use client";

import { useEffect, useState } from "react";
import { Check, CreditCard, Plus, Save } from "lucide-react";

import AdminLayout from "@/components/layout/admin-layout";

interface Plan {
  code: string;
  name: string;
  description: string;
  amountXof: number;
  durationDays: number;
  features: string[];
  active: boolean;
  sortOrder: number;
}

const EMPTY_PLAN: Plan = {
  code: "premium-new",
  name: "Nouvelle offre",
  description: "",
  amountXof: 6900,
  durationDays: 30,
  features: ["Demandes illimitées", "Filtres avancés"],
  active: true,
  sortOrder: 4,
};

export default function AdminTarifsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [draft, setDraft] = useState<Plan>(EMPTY_PLAN);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  const load = async () => {
    setError("");
    try {
      const response = await fetch("/api/admin/plans");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Chargement impossible.");
      setPlans(result.plans);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Chargement impossible.");
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/plans")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Chargement impossible.");
        if (active) setPlans(result.plans);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Chargement impossible.");
      });
    return () => { active = false; };
  }, []);

  const save = async (plan: Plan) => {
    setError("");
    setSaved("");
    const response = await fetch("/api/admin/plans", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(plan),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Enregistrement impossible.");
      return;
    }
    setSaved(plan.code);
    await load();
  };

  const disable = async (code: string) => {
    const response = await fetch(`/api/admin/plans?code=${encodeURIComponent(code)}`, { method: "DELETE" });
    if (response.ok) await load();
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-lavender)]">Facturation</p>
            <h1 className="text-2xl font-bold text-[var(--color-midnight)]">Abonnements Premium</h1>
          </div>
          <button onClick={() => setDraft({ ...EMPTY_PLAN, code: `premium-${plans.length + 1}`, sortOrder: plans.length + 1 })} className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-beige-dark)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-midnight)]">
            <Plus size={16} /> Nouvelle offre
          </button>
        </div>

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <section key={plan.code} className={`rounded-2xl border bg-white p-5 shadow-sm ${plan.active ? "border-[var(--color-beige-dark)]" : "border-slate-200 opacity-65"}`}>
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-lavender-light)] text-[var(--color-lavender)]"><CreditCard size={19} /></div>
                <button onClick={() => void disable(plan.code)} disabled={!plan.active} className="text-xs font-semibold text-red-500 disabled:text-slate-400">{plan.active ? "Désactiver" : "Inactive"}</button>
              </div>
              <label className="mb-3 block"><span className="mb-1 block text-xs font-semibold text-slate-500">Nom</span><input value={plan.name} onChange={(event) => setPlans((items) => items.map((item) => item.code === plan.code ? { ...item, name: event.target.value } : item))} className="w-full rounded-xl border border-[var(--color-beige-dark)] px-3 py-2.5 text-sm" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label><span className="mb-1 block text-xs font-semibold text-slate-500">Prix XOF</span><input type="number" min="100" value={plan.amountXof} onChange={(event) => setPlans((items) => items.map((item) => item.code === plan.code ? { ...item, amountXof: Number(event.target.value) } : item))} className="w-full rounded-xl border border-[var(--color-beige-dark)] px-3 py-2.5 text-sm" /></label>
                <label><span className="mb-1 block text-xs font-semibold text-slate-500">Durée jours</span><input type="number" min="1" value={plan.durationDays} onChange={(event) => setPlans((items) => items.map((item) => item.code === plan.code ? { ...item, durationDays: Number(event.target.value) } : item))} className="w-full rounded-xl border border-[var(--color-beige-dark)] px-3 py-2.5 text-sm" /></label>
              </div>
              <button onClick={() => void save(plan)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white" style={{ background: "var(--color-midnight)" }}>
                {saved === plan.code ? <><Check size={16} /> Enregistré</> : <><Save size={16} /> Enregistrer</>}
              </button>
            </section>
          ))}
        </div>

        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-[var(--color-midnight)]">Créer une offre</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <input value={draft.code} onChange={(event) => setDraft({ ...draft, code: event.target.value })} placeholder="Code technique" className="rounded-xl border border-[var(--color-beige-dark)] px-3 py-2.5 text-sm" />
            <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Nom public" className="rounded-xl border border-[var(--color-beige-dark)] px-3 py-2.5 text-sm" />
            <input type="number" value={draft.amountXof} onChange={(event) => setDraft({ ...draft, amountXof: Number(event.target.value) })} placeholder="Prix XOF" className="rounded-xl border border-[var(--color-beige-dark)] px-3 py-2.5 text-sm" />
            <input type="number" value={draft.durationDays} onChange={(event) => setDraft({ ...draft, durationDays: Number(event.target.value) })} placeholder="Durée" className="rounded-xl border border-[var(--color-beige-dark)] px-3 py-2.5 text-sm" />
          </div>
          <button onClick={() => void save(draft)} className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white" style={{ background: "var(--color-gold)" }}><Plus size={16} /> Ajouter l&apos;offre</button>
        </section>
      </div>
    </AdminLayout>
  );
}
