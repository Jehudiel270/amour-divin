import { count, desc, gte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { profiles, reports } from "@/db/schema";
import { getAdminUserId } from "@/lib/auth/authorization";
import { getDatabase } from "@/lib/db";

export async function GET() {
  try {
    if (!(await getAdminUserId("dashboard"))) return NextResponse.json({ error: "Permission tableau de bord requise." }, { status: 403 });
    const db = getDatabase();
    const [profileCounts] = await db.select({
      total: count(),
      newThisWeek: sql<number>`count(*) filter (where ${profiles.createdAt} >= now() - interval '7 days')::int`,
      pending: sql<number>`count(*) filter (where ${profiles.status} = 'pending')::int`,
      active: sql<number>`count(*) filter (where ${profiles.status} = 'active')::int`,
    }).from(profiles);
    const [reportCounts] = await db.select({
      pending: sql<number>`count(*) filter (where ${reports.status} in ('pending', 'reviewing'))::int`,
    }).from(reports);

    const recentUsers = await db.select({
      id: profiles.userId,
      name: profiles.firstName,
      city: profiles.city,
      status: profiles.status,
      createdAt: profiles.createdAt,
    }).from(profiles).orderBy(desc(profiles.createdAt)).limit(5);

    const recentReports = await db.select({
      id: reports.id,
      targetUserId: reports.targetUserId,
      reason: reports.reason,
      status: reports.status,
      createdAt: reports.createdAt,
    }).from(reports).orderBy(desc(reports.createdAt)).limit(5);

    const activity = await db.select({
      day: sql<string>`to_char(date_trunc('day', ${profiles.createdAt}), 'YYYY-MM-DD')`,
      members: count(),
    }).from(profiles)
      .where(gte(profiles.createdAt, sql`now() - interval '6 days'`))
      .groupBy(sql`date_trunc('day', ${profiles.createdAt})`)
      .orderBy(sql`date_trunc('day', ${profiles.createdAt})`);

    return NextResponse.json({
      stats: [
        { label: "Membres", value: profileCounts.total, change: `${profileCounts.active} profils actifs` },
        { label: "Nouveaux (7 jours)", value: profileCounts.newThisWeek, change: "Inscrits cette semaine" },
        { label: "Signalements ouverts", value: reportCounts.pending, change: "À traiter" },
        { label: "Profils à valider", value: profileCounts.pending, change: "En attente de modération" },
      ],
      recentUsers,
      recentReports,
      activity,
    });
  } catch {
    return NextResponse.json({ error: "Tableau de bord indisponible." }, { status: 503 });
  }
}
