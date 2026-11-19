import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { favorites, profiles } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";
import { listPublicProfiles } from "@/lib/profiles/public";

const inputSchema = z.object({ targetUserId: z.string().min(1).max(128) });

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const saved = await getDatabase().select({ targetUserId: favorites.targetUserId })
      .from(favorites).where(eq(favorites.userId, userId));
    const allowedProfiles = await listPublicProfiles(undefined, 200);
    const savedIds = new Set(saved.map((favorite) => favorite.targetUserId));
    return NextResponse.json({ favorites: allowedProfiles.filter((profile) => savedIds.has(profile.id)) });
  } catch {
    return NextResponse.json({ error: "Service des favoris indisponible." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const parsed = inputSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Profil cible invalide." }, { status: 400 });
    if (parsed.data.targetUserId === userId) return NextResponse.json({ error: "Action impossible sur votre profil." }, { status: 400 });

    const db = getDatabase();
    const [target] = await db.select({ userId: profiles.userId }).from(profiles)
      .where(and(eq(profiles.userId, parsed.data.targetUserId), eq(profiles.status, "active"), eq(profiles.isVisible, true)))
      .limit(1);
    if (!target) return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });

    await db.insert(favorites).values({ userId, targetUserId: target.userId }).onConflictDoNothing();
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Impossible d'enregistrer ce favori." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const parsed = inputSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Profil cible invalide." }, { status: 400 });

    await getDatabase().delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.targetUserId, parsed.data.targetUserId)));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Impossible de retirer ce favori." }, { status: 503 });
  }
}
