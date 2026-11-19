import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { payments, profiles, subscriptionPlans, subscriptions } from "@/db/schema";
import { getCurrentUserId, getSession } from "@/lib/auth/session";
import { asFedaPayRecord, fedapayRequest } from "@/lib/payments/fedapay";
import { getDatabase } from "@/lib/db";

const checkoutInput = z.object({ planCode: z.string().trim().min(3).max(40) });

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const parsed = checkoutInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Offre invalide." }, { status: 400 });

    const db = getDatabase();
    const [plan] = await db.select().from(subscriptionPlans)
      .where(eq(subscriptionPlans.code, parsed.data.planCode))
      .limit(1);
    if (!plan || !plan.active) {
      return NextResponse.json({ error: "Cette offre n'est pas disponible." }, { status: 409 });
    }
    const amount = plan.amountXof;

    const session = await getSession();
    const [profile] = await getDatabase().select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    if (!profile || profile.status !== "active") {
      return NextResponse.json({ error: "Un profil publié est requis avant de souscrire." }, { status: 409 });
    }

    const reference = `AD-${crypto.randomUUID()}`;
    const [subscription] = await db.insert(subscriptions).values({ userId, planCode: parsed.data.planCode, status: "pending" }).returning();
    const [payment] = await db.insert(payments).values({
      userId,
      subscriptionId: subscription.id,
      merchantReference: reference,
      amount,
      currency: "XOF",
      status: "pending",
    }).returning();

    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!appUrl) throw new Error("La variable NEXT_PUBLIC_APP_URL n’est pas configurée.");
      const callback = new URL("/paiement/retour", appUrl);
      callback.searchParams.set("payment_id", payment.id);
      const transactionResponse = await fedapayRequest("/transactions", {
        method: "POST",
        body: JSON.stringify({
        description: "Amour Divin Premium - 30 jours",
        amount,
        currency: { iso: "XOF" },
        callback_url: callback.toString(),
        merchant_reference: reference,
        custom_metadata: { payment_id: payment.id, subscription_id: subscription.id },
        customer: {
          email: session?.user?.email,
          firstname: profile.firstName,
        },
        }),
      });
      const transaction = asFedaPayRecord(transactionResponse);
      const transactionId = transaction?.id;
      if (transactionId === undefined || transactionId === null) throw new Error("La réponse FedaPay ne contient aucun identifiant de transaction.");

      const tokenResponse = await fedapayRequest(`/transactions/${encodeURIComponent(String(transactionId))}/token`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      const token = asFedaPayRecord(tokenResponse);
      const nestedToken = token?.token && typeof token.token === "object" ? token.token as Record<string, unknown> : null;
      const paymentUrl = token?.url ?? nestedToken?.url;
      if (typeof paymentUrl !== "string" || !paymentUrl.startsWith("https://")) {
        throw new Error("FedaPay n’a pas renvoyé d’adresse de paiement sécurisée.");
      }

      await db.update(payments).set({ providerTransactionId: String(transactionId), updatedAt: new Date() }).where(eq(payments.id, payment.id));
      return NextResponse.json({ paymentUrl });
    } catch (error) {
      await db.update(payments).set({ status: "declined", updatedAt: new Date() }).where(eq(payments.id, payment.id));
      await db.update(subscriptions).set({ status: "canceled" }).where(eq(subscriptions.id, subscription.id));
      throw error;
    }
  } catch {
    return NextResponse.json({ error: "Impossible de démarrer le paiement. Réessayez plus tard." }, { status: 503 });
  }
}
