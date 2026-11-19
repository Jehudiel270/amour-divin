import { and, desc, eq, gt, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

import { payments, subscriptionPlans, subscriptions } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth/session";
import { asFedaPayRecord, fedapayRequest } from "@/lib/payments/fedapay";
import { getDatabase } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const db = getDatabase();
    const paymentId = new URL(request.url).searchParams.get("payment_id");
    if (!paymentId) {
      const [activeSubscription] = await db.select({ planCode: subscriptions.planCode, endsAt: subscriptions.endsAt })
        .from(subscriptions)
        .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active"), gt(subscriptions.endsAt, new Date())))
        .orderBy(desc(subscriptions.endsAt))
        .limit(1);
      const plans = await db.select().from(subscriptionPlans)
        .where(eq(subscriptionPlans.active, true))
        .orderBy(desc(subscriptionPlans.sortOrder));
      return NextResponse.json({
        subscription: activeSubscription ?? null,
        plans,
      });
    }

    const [payment] = await db.select().from(payments)
      .where(and(eq(payments.id, paymentId), eq(payments.userId, userId)))
      .limit(1);
    if (!payment) return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });

    if (payment.status === "pending" && payment.providerTransactionId) {
      const transactionResponse = await fedapayRequest(`/transactions/${encodeURIComponent(payment.providerTransactionId)}`);
      const transaction = asFedaPayRecord(transactionResponse);
      const providerStatus = String(transaction?.status ?? "").toLowerCase();
      const status = providerStatus === "refunded" ? "refunded" : providerStatus === "approved" ? "approved" : null;
      if (status) {
        const [updated] = await db.update(payments)
          .set({ status, updatedAt: new Date() })
          .where(and(eq(payments.id, payment.id), inArray(payments.status, status === "refunded" ? ["approved"] : ["pending", "declined", "canceled"])))
          .returning({ id: payments.id, subscriptionId: payments.subscriptionId });

        if (updated?.subscriptionId) {
          if (status === "approved") {
            const [subscription] = await db.select({ planCode: subscriptions.planCode })
              .from(subscriptions).where(eq(subscriptions.id, updated.subscriptionId)).limit(1);
            const [plan] = subscription ? await db.select({ durationDays: subscriptionPlans.durationDays })
              .from(subscriptionPlans).where(eq(subscriptionPlans.code, subscription.planCode)).limit(1) : [];
            const durationDays = plan?.durationDays ?? 30;
            const startsAt = new Date();
            const endsAt = new Date(startsAt.getTime() + durationDays * 24 * 60 * 60 * 1000);
            await db.update(subscriptions).set({ status: "active", startsAt, endsAt })
              .where(eq(subscriptions.id, updated.subscriptionId));
          } else {
            await db.update(subscriptions).set({ status: "refunded" })
              .where(eq(subscriptions.id, updated.subscriptionId));
          }
        }
      }
    }

    const [current] = await db.select({ status: payments.status }).from(payments).where(eq(payments.id, payment.id)).limit(1);
    return NextResponse.json({ status: current?.status ?? "pending" });
  } catch {
    return NextResponse.json({ error: "Impossible de vérifier le paiement." }, { status: 503 });
  }
}
