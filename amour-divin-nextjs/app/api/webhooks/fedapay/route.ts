import { and, eq, inArray, or } from "drizzle-orm";
import { NextResponse } from "next/server";

import { payments, subscriptionPlans, subscriptions, webhookEvents } from "@/db/schema";
import { asFedaPayRecord, fedapayRequest, verifyFedaPayWebhook } from "@/lib/payments/fedapay";
import { getDatabase } from "@/lib/db";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" ? value as Record<string, unknown> : null;
}

export async function POST(request: Request) {
  const secret = process.env.FEDAPAY_WEBHOOK_SECRET;
  const signature = request.headers.get("x-fedapay-signature");
  if (!secret || !signature) return NextResponse.json({ error: "Signature requise." }, { status: 400 });

  const rawBody = await request.text();
  if (!verifyFedaPayWebhook(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  let event: Record<string, unknown>;
  try {
    event = asRecord(JSON.parse(rawBody)) ?? {};
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  const eventName = typeof event.name === "string" ? event.name : "unknown";
  const eventObject = asRecord(event.object);
  const nestedTransaction = asRecord(eventObject?.transaction);
  const transactionIdValue = nestedTransaction?.id ?? eventObject?.id;
  const transactionId = transactionIdValue === undefined || transactionIdValue === null ? "" : String(transactionIdValue);
  const eventIdValue = event.id ?? `${transactionId}:${eventName}`;
  const eventId = String(eventIdValue);

  if (!transactionId) return NextResponse.json({ error: "Transaction absente." }, { status: 400 });

  try {
    const db = getDatabase();
    const [storedEvent] = await db.insert(webhookEvents).values({
      provider: "fedapay",
      providerEventId: eventId,
      eventType: eventName,
      payload: event,
    }).onConflictDoNothing().returning({ id: webhookEvents.id, processedAt: webhookEvents.processedAt });

    let currentEvent = storedEvent;
    if (!currentEvent) {
      const [existing] = await db.select({ id: webhookEvents.id, processedAt: webhookEvents.processedAt })
        .from(webhookEvents)
        .where(and(eq(webhookEvents.provider, "fedapay"), eq(webhookEvents.providerEventId, eventId)))
        .limit(1);
      if (existing?.processedAt) return NextResponse.json({ received: true, duplicate: true });
      currentEvent = existing;
    }

    const [payment] = await db.select().from(payments)
      .where(or(eq(payments.providerTransactionId, transactionId), eq(payments.merchantReference, transactionId)))
      .limit(1);
    if (!payment) return NextResponse.json({ error: "Paiement inconnu." }, { status: 404 });

    const providerResponse = await fedapayRequest(`/transactions/${encodeURIComponent(transactionId)}`);
    const providerTransaction = asFedaPayRecord(providerResponse);
    const providerStatus = String(providerTransaction?.status ?? "").toLowerCase();
    let nextStatus: "approved" | "declined" | "canceled" | "refunded" | null = null;

    if (providerStatus === "refunded") nextStatus = "refunded";
    else if (providerStatus === "approved") nextStatus = "approved";
    else if (providerStatus === "canceled") nextStatus = "canceled";
    else if (providerStatus === "declined") nextStatus = "declined";

    if (nextStatus) {
      const allowedStatuses = nextStatus === "refunded" ? ["approved"] as const : ["pending", "declined", "canceled"] as const;
      const [updatedPayment] = await db.update(payments)
        .set({ status: nextStatus, updatedAt: new Date() })
        .where(and(eq(payments.id, payment.id), inArray(payments.status, [...allowedStatuses])))
        .returning({ subscriptionId: payments.subscriptionId });

      if (updatedPayment?.subscriptionId) {
        if (nextStatus === "approved") {
          const [subscription] = await db.select({ planCode: subscriptions.planCode })
            .from(subscriptions).where(eq(subscriptions.id, updatedPayment.subscriptionId)).limit(1);
          const [plan] = subscription ? await db.select({ durationDays: subscriptionPlans.durationDays })
            .from(subscriptionPlans).where(eq(subscriptionPlans.code, subscription.planCode)).limit(1) : [];
          const durationDays = plan?.durationDays ?? 30;
          const startsAt = new Date();
          const endsAt = new Date(startsAt.getTime() + durationDays * 24 * 60 * 60 * 1000);
          await db.update(subscriptions).set({ status: "active", startsAt, endsAt }).where(eq(subscriptions.id, updatedPayment.subscriptionId));
        } else {
          await db.update(subscriptions).set({ status: nextStatus === "refunded" ? "refunded" : "canceled" })
            .where(eq(subscriptions.id, updatedPayment.subscriptionId));
        }
      }
    }

    if (currentEvent) await db.update(webhookEvents).set({ processedAt: new Date() }).where(eq(webhookEvents.id, currentEvent.id));
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Événement temporairement indisponible." }, { status: 500 });
  }
}
