import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { profiles, reports } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";

const reportInput = z.object({
  targetUserId: z.string().min(1).max(128),
  reason: z.enum(["fake_profile", "harassment", "inappropriate_content", "scam", "minor_suspected", "other"]),
  details: z.string().trim().max(4000).default(""),
});

export async function POST(request: Request) {
  try {
    const reporterId = await getCurrentUserId();
    if (!reporterId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const parsed = reportInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Signalement invalide." }, { status: 400 });
    if (parsed.data.targetUserId === reporterId) return NextResponse.json({ error: "Vous ne pouvez pas signaler votre propre profil." }, { status: 400 });

    const [target] = await getDatabase().select({ userId: profiles.userId }).from(profiles)
      .where(and(eq(profiles.userId, parsed.data.targetUserId), eq(profiles.status, "active")))
      .limit(1);
    if (!target) return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });

    const [created] = await getDatabase().insert(reports).values({
      reporterId,
      targetUserId: target.userId,
      reason: parsed.data.reason,
      details: parsed.data.details,
    }).returning({ id: reports.id, status: reports.status, createdAt: reports.createdAt });

    return NextResponse.json({ report: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Impossible d'envoyer le signalement." }, { status: 503 });
  }
}
