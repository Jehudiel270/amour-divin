import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { adminActions, profiles } from "@/db/schema";
import { getAdminUserId } from "@/lib/auth/authorization";
import { getDatabase } from "@/lib/db";

const updateInput = z.object({
  userId: z.string().min(1).max(128),
  status: z.enum(["active", "suspended", "pending"]),
});

export async function GET() {
  try {
    if (!(await getAdminUserId("users"))) return NextResponse.json({ error: "Permission utilisateurs requise." }, { status: 403 });
    const users = await getDatabase().select({
      id: profiles.userId,
      name: profiles.firstName,
      city: profiles.city,
      birthDate: profiles.birthDate,
      status: profiles.status,
      createdAt: profiles.createdAt,
    }).from(profiles);
    return NextResponse.json({ users: users.map(({ birthDate, ...user }) => ({
      ...user,
      age: new Date().getUTCFullYear() - new Date(birthDate).getUTCFullYear(),
    })) });
  } catch {
    return NextResponse.json({ error: "Liste des utilisateurs indisponible." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    const adminId = await getAdminUserId("users");
    if (!adminId) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
    const parsed = updateInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Statut invalide." }, { status: 400 });

    const [updated] = await getDatabase().update(profiles)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(profiles.userId, parsed.data.userId))
      .returning({ userId: profiles.userId, status: profiles.status });
    if (!updated) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });

    await getDatabase().insert(adminActions).values({
      adminUserId: adminId,
      action: `user_${parsed.data.status}`,
      targetUserId: updated.userId,
    });
    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ error: "Impossible de mettre à jour le compte." }, { status: 503 });
  }
}
