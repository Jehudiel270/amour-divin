import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { adminActions, profilePhotos, profiles } from "@/db/schema";
import { getAdminUserId } from "@/lib/auth/authorization";
import { getDatabase } from "@/lib/db";

const moderationInput = z.object({
  userId: z.string().min(1).max(128),
  action: z.enum(["approve", "reject", "suspend"]),
});

function isAdult(birthDate: string) {
  const birth = new Date(`${birthDate}T00:00:00.000Z`);
  const now = new Date();
  const cutoff = new Date(Date.UTC(now.getUTCFullYear() - 18, now.getUTCMonth(), now.getUTCDate()));
  return Number.isFinite(birth.getTime()) && birth <= cutoff;
}

export async function GET() {
  try {
    const adminId = await getAdminUserId("profiles");
    if (!adminId) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });

    const pending = await getDatabase().select({ profile: profiles, photo: profilePhotos })
      .from(profiles)
      .leftJoin(profilePhotos, and(eq(profilePhotos.userId, profiles.userId), eq(profilePhotos.position, 0)))
      .where(eq(profiles.status, "pending"))
      .orderBy(asc(profiles.createdAt));

    return NextResponse.json({ profiles: pending.map(({ profile, photo }) => ({
      id: profile.userId,
      firstName: profile.firstName,
      birthDate: profile.birthDate,
      city: profile.city,
      profession: profile.profession,
      church: profile.church,
      bio: profile.bio,
      photoUrl: photo?.secureUrl ?? null,
      photoStatus: photo?.status ?? null,
    })) });
  } catch {
    return NextResponse.json({ error: "File de modération indisponible." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    const adminId = await getAdminUserId("profiles");
    if (!adminId) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });

    const parsed = moderationInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Décision de modération invalide." }, { status: 400 });

    const db = getDatabase();
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, parsed.data.userId)).limit(1);
    if (!profile) return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });

    let nextStatus: "active" | "draft" | "suspended";
    if (parsed.data.action === "approve") {
      if (!isAdult(profile.birthDate)) return NextResponse.json({ error: "Le profil ne satisfait pas le critère d'âge." }, { status: 409 });
      const [photo] = await db.select({ id: profilePhotos.id }).from(profilePhotos)
        .where(and(eq(profilePhotos.userId, profile.userId), eq(profilePhotos.position, 0), eq(profilePhotos.status, "pending")))
        .limit(1);
      if (!photo) return NextResponse.json({ error: "Une photo principale en attente de validation est requise." }, { status: 409 });
      await db.update(profilePhotos).set({ status: "approved" })
        .where(and(eq(profilePhotos.userId, profile.userId), eq(profilePhotos.status, "pending")));
      nextStatus = "active";
    } else if (parsed.data.action === "suspend") {
      nextStatus = "suspended";
    } else {
      await db.update(profilePhotos).set({ status: "rejected" }).where(eq(profilePhotos.userId, profile.userId));
      nextStatus = "draft";
    }

    await db.update(profiles).set({ status: nextStatus, updatedAt: new Date() }).where(eq(profiles.userId, profile.userId));
    await db.insert(adminActions).values({
      adminUserId: adminId,
      action: `profile_${parsed.data.action}`,
      targetUserId: profile.userId,
    });

    return NextResponse.json({ userId: profile.userId, status: nextStatus });
  } catch {
    return NextResponse.json({ error: "Impossible d'enregistrer la décision." }, { status: 503 });
  }
}
