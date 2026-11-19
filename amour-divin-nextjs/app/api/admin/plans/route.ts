import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { subscriptionPlans } from "@/db/schema";
import { getAdminUserId } from "@/lib/auth/authorization";
import { getDatabase } from "@/lib/db";

const planSchema = z.object({
  code: z.string().min(3).max(40).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(240).default(""),
  amountXof: z.number().int().min(100).max(10000000),
  durationDays: z.number().int().min(1).max(365),
  features: z.array(z.string().trim().min(1).max(120)).max(12).default([]),
  active: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(100).default(0),
});

export async function GET() {
  try {
    if (!(await getAdminUserId("billing"))) {
      return NextResponse.json({ error: "Permission facturation requise." }, { status: 403 });
    }
    const db = getDatabase();
    const plans = await db.select().from(subscriptionPlans).orderBy(asc(subscriptionPlans.sortOrder), asc(subscriptionPlans.code));
    return NextResponse.json({ plans });
  } catch {
    return NextResponse.json({ error: "Impossible de charger les tarifs." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  try {
    const adminId = await getAdminUserId("billing");
    if (!adminId) return NextResponse.json({ error: "Permission facturation requise." }, { status: 403 });

    const parsed = planSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Offre invalide." }, { status: 400 });

    const db = getDatabase();
    const [plan] = await db.insert(subscriptionPlans).values({
      code: parsed.data.code,
      name: parsed.data.name,
      description: parsed.data.description,
      amountXof: parsed.data.amountXof,
      durationDays: parsed.data.durationDays,
      features: parsed.data.features,
      active: parsed.data.active,
      sortOrder: parsed.data.sortOrder,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: subscriptionPlans.code,
      set: {
        name: parsed.data.name,
        description: parsed.data.description,
        amountXof: parsed.data.amountXof,
        durationDays: parsed.data.durationDays,
        features: parsed.data.features,
        active: parsed.data.active,
        sortOrder: parsed.data.sortOrder,
        updatedAt: new Date(),
      },
    }).returning();

    await db.insert((await import("@/db/schema")).adminActions).values({
      adminUserId: adminId,
      action: "subscription_plan_updated",
      metadata: { code: plan.code, amountXof: plan.amountXof, durationDays: plan.durationDays },
    });

    return NextResponse.json({ plan });
  } catch {
    return NextResponse.json({ error: "Impossible d'enregistrer le tarif." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  try {
    const adminId = await getAdminUserId("billing");
    if (!adminId) return NextResponse.json({ error: "Permission facturation requise." }, { status: 403 });

    const code = new URL(request.url).searchParams.get("code")?.trim();
    if (!code) return NextResponse.json({ error: "Code d'offre requis." }, { status: 400 });

    const db = getDatabase();
    await db.update(subscriptionPlans).set({ active: false, updatedAt: new Date() }).where(eq(subscriptionPlans.code, code));
    await db.insert((await import("@/db/schema")).adminActions).values({ adminUserId: adminId, action: "subscription_plan_disabled", metadata: { code } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Impossible de désactiver l'offre." }, { status: 503 });
  }
}
