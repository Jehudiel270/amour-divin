import { eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { adminPermissions, adminActions, profiles } from "@/db/schema";
import { getAdminContext } from "@/lib/auth/authorization";
import { getDatabase } from "@/lib/db";

const roleInput = z.object({
  userId: z.string().min(1).max(128),
  role: z.enum(["member", "admin", "super_admin"]),
  permissions: z.array(z.enum(["dashboard", "users", "profiles", "reports", "contact", "billing", "content"])).max(7).default([]),
});

export async function GET() {
  try {
    const context = await getAdminContext();
    if (context?.role !== "super_admin") return NextResponse.json({ error: "Réservé aux super administrateurs." }, { status: 403 });

    const db = getDatabase();
    const team = await db.select({
      userId: profiles.userId,
      firstName: profiles.firstName,
      role: profiles.role,
      status: profiles.status,
      createdAt: profiles.createdAt,
    }).from(profiles).where(inArray(profiles.role, ["admin", "super_admin"]));

    const permissions = await db.select().from(adminPermissions);
    return NextResponse.json({
      team: team.map((member) => ({
        ...member,
        permissions: permissions.filter((permission) => permission.userId === member.userId).map((permission) => permission.permission),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Équipe administrateur indisponible." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    const context = await getAdminContext();
    if (context?.role !== "super_admin") return NextResponse.json({ error: "Réservé aux super administrateurs." }, { status: 403 });

    const parsed = roleInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Rôle ou permissions invalides." }, { status: 400 });

    const db = getDatabase();
    const [updated] = await db.update(profiles).set({ role: parsed.data.role, updatedAt: new Date() })
      .where(eq(profiles.userId, parsed.data.userId))
      .returning({ userId: profiles.userId, role: profiles.role });
    if (!updated) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });

    await db.delete(adminPermissions).where(eq(adminPermissions.userId, parsed.data.userId));
    if (parsed.data.role === "admin" && parsed.data.permissions.length > 0) {
      await db.insert(adminPermissions).values(parsed.data.permissions.map((permission) => ({
        userId: parsed.data.userId,
        permission,
      })));
    }

    await db.insert(adminActions).values({
      adminUserId: context.userId,
      action: `team_role_${parsed.data.role}`,
      targetUserId: parsed.data.userId,
      metadata: { permissions: parsed.data.permissions },
    });

    return NextResponse.json({ member: updated });
  } catch {
    return NextResponse.json({ error: "Impossible de modifier le rôle." }, { status: 503 });
  }
}
