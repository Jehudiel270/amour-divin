"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, RefreshCw } from "lucide-react";

export default function PaymentReturnStatus({ paymentId }: { paymentId: string }) {
  const [status, setStatus] = useState<"idle" | "pending" | "approved" | "failed">("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verify = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/billing/status?payment_id=${encodeURIComponent(paymentId)}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Impossible de vérifier le paiement.");
      setStatus(result.status === "approved" ? "approved" : ["declined", "canceled", "refunded"].includes(result.status) ? "failed" : "pending");
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "Impossible de vérifier le paiement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-lavender-light)] text-[var(--color-lavender)]">
        <CheckCircle size={26} />
      </div>
      <h1 className="mb-3 font-display text-3xl font-bold text-[var(--color-midnight)]">Confirmation du paiement</h1>
      {status === "approved" ? (
        <p className="mb-8 text-sm text-green-700">Votre paiement est confirmé. AD Premium est activé pour 30 jours.</p>
      ) : status === "failed" ? (
        <p className="mb-8 text-sm text-red-600">Le paiement n&apos;a pas été validé. Vous pouvez vérifier à nouveau ou relancer le paiement.</p>
      ) : (
        <p className="mb-8 text-sm text-slate-600">Le paiement peut prendre quelques instants à être confirmé. Le statut est vérifié auprès du serveur, pas depuis l&apos;adresse de retour.</p>
      )}
      {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
      {status !== "approved" && (
        <button onClick={() => void verify()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:opacity-50" style={{ background: "var(--color-midnight)" }}>
          <RefreshCw size={15} /> {loading ? "Vérification..." : "Vérifier le statut"}
        </button>
      )}
      <div className="mt-6">
        <Link href="/reglages" className="text-sm font-medium text-[var(--color-lavender)] hover:underline">Retour aux réglages</Link>
      </div>
    </div>
  );
}
