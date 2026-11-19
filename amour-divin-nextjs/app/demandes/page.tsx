"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, X, Eye, Send } from "lucide-react";

import { unsplashUrl } from "@/data/profiles";
import type { Profile } from "@/types";

interface ConnectionRequest extends Profile {
  requestId: string;
  direction: "sent" | "received";
  status: "pending" | "accepted" | "declined" | "withdrawn";
  message: string;
  createdAt: string;
}

import Image from "next/image";
export default function Requests() {
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/connection-requests")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Demandes indisponibles.");
        if (active) setRequests(result.requests);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Demandes indisponibles.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const received = requests.filter((request) => request.direction === "received" && request.status === "pending");
  const sent = requests.filter((request) => request.direction === "sent" && request.status === "pending");

  const updateRequest = async (request: ConnectionRequest, status: "accepted" | "declined" | "withdrawn") => {
    setBusyId(request.requestId);
    setError("");
    try {
      const response = await fetch("/api/connection-requests", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ requestId: request.requestId, status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Demande non mise à jour.");
      setRequests((current) => current.map((item) => item.requestId === request.requestId ? { ...item, status } : item));
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Demande non mise à jour.");
    } finally {
      setBusyId(null);
    }
  };

  const visibleRequests = tab === "received" ? received : sent;

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">
        <h1 className="mb-8 font-display text-3xl font-bold text-[var(--color-midnight)]">Demandes</h1>
        <div className="mb-8 flex gap-1 rounded-2xl bg-[var(--color-beige)] p-1">
          <button onClick={() => setTab("received")} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold ${tab === "received" ? "bg-white text-[var(--color-midnight)] shadow-sm" : "text-slate-500"}`}>
            Reçues ({received.length})
          </button>
          <button onClick={() => setTab("sent")} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold ${tab === "sent" ? "bg-white text-[var(--color-midnight)] shadow-sm" : "text-slate-500"}`}>
            Envoyées ({sent.length})
          </button>
        </div>

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading ? (
          <p className="py-16 text-center text-sm text-slate-400">Chargement...</p>
        ) : visibleRequests.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="mb-2 font-display text-xl font-bold text-[var(--color-midnight)]">{tab === "received" ? "Aucune demande reçue" : "Aucune demande envoyée"}</h2>
            <p className="mb-6 text-sm text-slate-500">Les demandes de connexion apparaîtront ici.</p>
            {tab === "sent" && <Link href="/decouvrir" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white" style={{ background: "var(--color-midnight)" }}><Send size={15} /> Découvrir des profils</Link>}
          </div>
        ) : (
          <div className="space-y-4">
            {visibleRequests.map((request) => (
              <div key={request.requestId} className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm sm:flex-row">
                <Image src={unsplashUrl(request.photo, 80, 80)} alt={`Photo de ${request.firstName}`} width={64} height={64} sizes="64px" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h2 className="font-display font-bold text-[var(--color-midnight)]">{request.firstName}, {request.age}</h2>
                      <p className="text-sm text-slate-400">{request.city} · {request.profession}</p>
                    </div>
                    {request.verified && <span className="flex items-center gap-1 text-xs text-[var(--color-lavender)]"><CheckCircle size={12} /> Vérifié</span>}
                  </div>
                  {request.message && <p className="mb-4 text-sm italic text-slate-600">&quot;{request.message}&quot;</p>}
                  <div className="flex flex-wrap gap-2">
                    {tab === "received" ? (
                      <>
                        <button disabled={busyId === request.requestId} onClick={() => void updateRequest(request, "accepted")} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" style={{ background: "var(--color-midnight)" }}><CheckCircle size={14} /> Accepter</button>
                        <button disabled={busyId === request.requestId} onClick={() => void updateRequest(request, "declined")} className="flex items-center gap-1.5 rounded-xl border border-[var(--color-beige-dark)] px-4 py-2 text-sm text-slate-600 disabled:opacity-50"><X size={14} /> Refuser</button>
                      </>
                    ) : (
                      <button disabled={busyId === request.requestId} onClick={() => void updateRequest(request, "withdrawn")} className="flex items-center gap-1.5 rounded-xl border border-[var(--color-beige-dark)] px-4 py-2 text-sm text-slate-600 disabled:opacity-50"><X size={14} /> Annuler</button>
                    )}
                    <Link href={`/profil/${request.id}`} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm text-[var(--color-lavender)]"><Eye size={14} /> Voir le profil</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
