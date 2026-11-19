import "server-only";

import { verifyFedaPayWebhook } from "@/lib/payments/fedapay-signature";

function getCredentials() {
  const environment = process.env.FEDAPAY_ENVIRONMENT;
  if (environment !== "sandbox" && environment !== "live") {
    throw new Error("L’environnement FedaPay n’est pas configuré correctement.");
  }
  const apiKey = environment === "live"
    ? process.env.FEDAPAY_LIVE_SECRET_KEY
    : process.env.FEDAPAY_SECRET_KEY;
  if (!apiKey) throw new Error("La clé secrète FedaPay de cet environnement n’est pas configurée.");
  return { apiKey, environment };
}

export function getFedaPayApiBase() {
  const { environment } = getCredentials();
  return environment === "sandbox" ? "https://sandbox-api.fedapay.com/v1" : "https://api.fedapay.com/v1";
}

export async function fedapayRequest(path: string, init: RequestInit = {}) {
  const { apiKey } = getCredentials();
  const response = await fetch(`${getFedaPayApiBase()}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      "x-version": "1.1.1",
      ...init.headers,
    },
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`La requête FedaPay a échoué (code ${response.status}).`);
  return body;
}

export function asFedaPayRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const resourceKey = Object.keys(record).find((key) => key.startsWith("v1/"));
  if (resourceKey && record[resourceKey] && typeof record[resourceKey] === "object") {
    return record[resourceKey] as Record<string, unknown>;
  }
  if (record.data && typeof record.data === "object") return record.data as Record<string, unknown>;
  return record;
}

export { verifyFedaPayWebhook };
