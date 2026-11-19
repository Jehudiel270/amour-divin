"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Heart, MessageCircle } from "lucide-react";

interface MatchConversation {
  id: string;
  profile: { userId: string; firstName: string; age: number; city: string; profession: string; photo: string };
  lastMessage: { createdAt: string } | null;
}

import Image from "next/image";
export default function Matches() {
  const [matches, setMatches] = useState<MatchConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/conversations")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Matchs indisponibles.");
        if (active) setMatches(result.conversations);
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Matchs indisponibles.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-16">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-lavender-light)] text-[var(--color-lavender)]"><Heart size={20} /></div>
          <div>
            <h1 className="font-display text-3xl font-bold text-[var(--color-midnight)]">Mes matchs</h1>
            <p className="text-sm text-slate-500">{matches.length} connexion{matches.length > 1 ? "s" : ""} établie{matches.length > 1 ? "s" : ""}</p>
          </div>
        </div>

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading ? <p className="py-16 text-center text-sm text-slate-400">Chargement...</p> : matches.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="mb-2 font-display text-xl font-bold text-[var(--color-midnight)]">Pas encore de match</h2>
            <p className="mb-6 text-sm text-slate-500">Une conversation apparaîtra ici après l&apos;acceptation mutuelle d&apos;une demande.</p>
            <Link href="/decouvrir" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white" style={{ background: "var(--color-midnight)" }}>Découvrir des profils</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="flex flex-col items-start gap-5 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center">
                <Image src={match.profile.photo} alt={`Photo de ${match.profile.firstName}`} width={64} height={64} sizes="64px" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
                <div className="flex-1">
                  <h2 className="font-display text-lg font-bold text-[var(--color-midnight)]">{match.profile.firstName}, {match.profile.age}</h2>
                  <p className="text-sm text-slate-500">{match.profile.city} · {match.profile.profession}</p>
                  <p className="mt-1 text-xs text-slate-400">{match.lastMessage ? `Dernier échange ${new Date(match.lastMessage.createdAt).toLocaleDateString("fr-FR")}` : "Conversation prête"}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/messages?conversation=${match.id}`} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--color-midnight)" }}><MessageCircle size={14} /> Message</Link>
                  <Link href={`/profil/${match.profile.userId}`} aria-label={`Voir le profil de ${match.profile.firstName}`} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-beige-dark)] text-slate-600"><Eye size={14} /></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
