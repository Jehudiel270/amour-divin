import { and, eq, ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { adminActions, profiles, reports } from "@/db/schema";
import { getAdminUserId } from "@/lib/auth/authorization";
import { getDatabase } from "@/lib/db";

const updateInput = z.object({
  reportId: z.uuid(),
  status: z.enum(["reviewing", "resolved", "dismissed"]),
});

export async function GET() {
  try {
    const adminId = await getAdminUserId("reports");
    if (!adminId) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });

    const rows = await getDatabase().select({
      id: reports.id,
      reporterId: reports.reporterId,
      reporterName: profiles.firstName,
      targetUserId: reports.targetUserId,
      reason: reports.reason,
      details: reports.details,
      status: reports.status,
      createdAt: reports.createdAt,
    }).from(reports)
      .innerJoin(profiles, eq(reports.reporterId, profiles.userId))
      .orderBy(reports.createdAt);

    return NextResponse.json({ reports: rows });
  } catch {
    return NextResponse.json({ error: "Signalements indisponibles." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    const adminId = await getAdminUserId("reports");
    if (!adminId) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });

    const parsed = updateInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Décision invalide." }, { status: 400 });

    const [report] = await getDatabase().update(reports)
      .set({ status: parsed.data.status, assignedAdminId: adminId, resolvedAt: parsed.data.status === "reviewing" ? null : new Date() })
      .where(and(eq(reports.id, parsed.data.reportId), ne(reports.status, "resolved"), ne(reports.status, "dismissed")))
      .returning({ id: reports.id, targetUserId: reports.targetUserId, status: reports.status });
    if (!report) return NextResponse.json({ error: "Signalement introuvable ou déjà clos." }, { status: 404 });

    await getDatabase().insert(adminActions).values({
      adminUserId: adminId,
      action: `report_${parsed.data.status}`,
      targetUserId: report.targetUserId,
      metadata: { reportId: report.id },
    });
    return NextResponse.json({ report });
  } catch {
    return NextResponse.json({ error: "Impossible d'enregistrer la décision." }, { status: 503 });
  }
}
