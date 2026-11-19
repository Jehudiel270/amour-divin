"use client";

import { useEffect, useState } from "react";

import AdminLayout from "@/components/layout/admin-layout";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "closed";
  createdAt: string;
}

export default function AdminContact() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const response = await fetch("/api/admin/contact");
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Boîte de contact indisponible.");
        if (active) setMessages(result.messages);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Boîte de contact indisponible.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const closeMessage = async (messageId: string) => {
    const response = await fetch("/api/admin/contact", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: messageId, status: "closed" }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Impossible de clôturer le message.");
      return;
    }
    setMessages((current) => current.map((message) => message.id === messageId ? { ...message, status: "closed" } : message));
    setSelected(null);
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl px-8 py-10">
        <h1 className="mb-1 font-display text-2xl font-bold text-[var(--color-midnight)]">Messages de contact</h1>
        <p className="mb-6 text-sm text-slate-500">Demandes reçues depuis le formulaire public.</p>
        {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading ? <p className="py-10 text-center text-sm text-slate-400">Chargement...</p> : (
          <div className="space-y-3">
            {messages.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-400 shadow-sm">Aucun message reçu.</p>}
            {messages.map((message) => (
              <button key={message.id} onClick={() => setSelected(message)} className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white p-5 text-left shadow-sm">
                <span className="min-w-0">
                  <span className="mb-1 block text-sm font-medium text-[var(--color-midnight)]">{message.name} · {message.subject}</span>
                  <span className="block truncate text-xs text-slate-500">{message.message}</span>
                </span>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${message.status === "open" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"}`}>{message.status === "open" ? "Ouvert" : "Clôturé"}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <h2 className="mb-5 font-display text-xl font-bold text-[var(--color-midnight)]">{selected.subject}</h2>
            <div className="space-y-4 text-sm">
              <p><span className="font-semibold text-[var(--color-midnight)]">Expéditeur :</span> {selected.name} ({selected.email})</p>
              <p className="leading-relaxed text-slate-600">{selected.message}</p>
              <p className="text-xs text-slate-400">Reçu le {new Date(selected.createdAt).toLocaleString("fr-FR")}</p>
            </div>
            {selected.status === "open" && <button onClick={() => void closeMessage(selected.id)} className="mt-6 w-full rounded-xl py-3 text-sm font-semibold text-white" style={{ background: "var(--color-midnight)" }}>Clôturer</button>}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
