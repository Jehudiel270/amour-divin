"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCheck } from "lucide-react";

const TYPE_STYLES: Record<string, string> = {
  match: "var(--color-lavender-light)",
  request: "#fef9ef",
  message: "var(--color-lavender-light)",
  verified: "#f0faf4",
};

export default function Notifications() {
  const [items, setItems] = useState<Array<{ id: string; type: string; text: string; time: string; read: boolean; icon: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/notifications")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Notifications indisponibles.");
        if (!active) return;
        setItems(result.notifications.map((item: { id: string; kind: string; payload: Record<string, unknown>; readAt: string | null; createdAt: string }) => ({
          id: item.id,
          type: item.kind,
          text: typeof item.payload.text === "string" ? item.payload.text : "Une nouvelle activité concerne votre compte.",
          time: new Date(item.createdAt).toLocaleString("fr-FR"),
          read: Boolean(item.readAt),
          icon: item.kind === "match" ? "💞" : item.kind === "message" ? "💬" : item.kind === "request" ? "💌" : "🔔",
        })));
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Notifications indisponibles.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const markAllRead = async () => {
    const response = await fetch("/api/notifications", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({}) });
    if (response.ok) setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };
  const markRead = async (id: string) => {
    const response = await fetch("/api/notifications", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ notificationId: id }) });
    if (response.ok) setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-[var(--color-midnight)]">Notifications</h1>
            {unreadCount > 0 && <p className="text-slate-500 text-sm mt-1">{unreadCount} non lue(s)</p>}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-sm text-[var(--color-lavender)] hover:text-[var(--color-midnight)] font-medium transition-colors">
              <CheckCheck size={16} /> Tout marquer comme lu
            </button>
          )}
        </div>

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading ? (
          <p className="py-16 text-center text-sm text-slate-400">Chargement...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="font-display text-xl font-bold text-[var(--color-midnight)] mb-2">Aucune notification</h3>
            <p className="text-slate-500 text-sm">Vous serez averti(e) ici des nouvelles demandes, matchs et messages.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((n) => (
              <Link
                key={n.id}
                href={n.type === "message" ? "/messages" : n.type === "request" ? "/demandes" : n.type === "match" ? "/matchs" : "/reglages"}
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-4 p-5 rounded-2xl transition-all ${n.read ? "bg-white" : "shadow-sm"}`}
                style={{ background: n.read ? "white" : TYPE_STYLES[n.type] }}
              >
                <span className="text-2xl flex-shrink-0">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? "text-slate-600" : "text-[var(--color-midnight)] font-medium"}`}>{n.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--color-lavender)" }}></span>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
