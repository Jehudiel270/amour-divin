import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyFedaPayWebhook(payload: string, header: string, secret: string) {
  const parts = header.split(",").map((part) => part.trim().split("="));
  const timestamp = Number(parts.find(([key]) => key === "t")?.[1]);
  const signatures = parts.filter(([key]) => key === "s").map(([, signature]) => signature ?? "");
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (!Number.isSafeInteger(timestamp) || Math.abs(nowSeconds - timestamp) > 300 || signatures.length === 0) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`, "utf8").digest();
  return signatures.some((signature) => {
    if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
    const received = Buffer.from(signature, "hex");
    return received.length === expected.length && timingSafeEqual(received, expected);
  });
}
