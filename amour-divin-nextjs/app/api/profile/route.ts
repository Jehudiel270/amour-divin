import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { profiles, profilePreferences } from "@/db/schema";
import { getCurrentUserId, getSession } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";

const profileInput = z.object({
  firstName: z.string().trim().min(1).max(80),
  birthDate: z.iso.date(),
  city: z.string().trim().max(120).default(""),
  countryCode: z.string().trim().length(2).default(""),
  profession: z.string().trim().max(120).default(""),
  church: z.string().trim().max(160).default(""),
  bio: z.string().trim().max(500).default(""),
  lookingFor: z.string().trim().max(500).default(""),
  faithValues: z.array(z.string().trim().min(1).max(60)).max(5).default([]),
  interests: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  minAge: z.number().int().min(18).max(100).default(18),
  maxAge: z.number().int().min(18).max(100).default(70),
  maxDistanceKm: z.number().int().min(1).max(1000).default(100),
});

function isAdult(birthDate: string) {
  const birth = new Date(`${birthDate}T00:00:00.000Z`);
  const today = new Date();
  const cutoff = new Date(Date.UTC(today.getUTCFullYear() - 18, today.getUTCMonth(), today.getUTCDate()));
  return Number.isFinite(birth.getTime()) && birth <= cutoff;
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const [profile] = await getDatabase().select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    if (!profile) return NextResponse.json({ profile: null });

    const [preferences] = await getDatabase()
      .select()
      .from(profilePreferences)
      .where(eq(profilePreferences.userId, userId))
      .limit(1);

    return NextResponse.json({ profile, preferences: preferences ?? null });
  } catch {
    return NextResponse.json({ error: "Service de profil indisponible." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const parsed = profileInput.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Données de profil invalides.", details: parsed.error.flatten() }, { status: 400 });
    }

    const input = parsed.data;
    if (!isAdult(input.birthDate)) {
      return NextResponse.json({ error: "Le service est réservé aux personnes majeures." }, { status: 403 });
    }
    if (input.minAge > input.maxAge) {
      return NextResponse.json({ error: "La tranche d'âge est invalide." }, { status: 400 });
    }

    const db = getDatabase();
    const session = await getSession();
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
    const sessionEmail = session?.user?.email?.trim().toLowerCase();
    const profileRole = superAdminEmail && sessionEmail === superAdminEmail ? "super_admin" as const : "member" as const;
    const churchName = process.env.NEXT_PUBLIC_CHURCH_NAME?.trim() || "Église Amour Divin";
    const [profile] = await db
      .insert(profiles)
      .values({
        userId,
        firstName: input.firstName,
        birthDate: input.birthDate,
        city: input.city,
        countryCode: input.countryCode.toUpperCase(),
        profession: input.profession,
        church: churchName,
        bio: input.bio,
        lookingFor: input.lookingFor,
        faithValues: input.faithValues,
        interests: input.interests,
        status: "pending",
        role: profileRole,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          firstName: input.firstName,
          birthDate: input.birthDate,
          city: input.city,
          countryCode: input.countryCode.toUpperCase(),
          profession: input.profession,
          church: churchName,
          bio: input.bio,
          lookingFor: input.lookingFor,
          faithValues: input.faithValues,
          interests: input.interests,
          status: "pending",
          role: profileRole,
          updatedAt: new Date(),
        },
      })
      .returning();

    await db
      .insert(profilePreferences)
      .values({ userId, minAge: input.minAge, maxAge: input.maxAge, maxDistanceKm: input.maxDistanceKm })
      .onConflictDoUpdate({
        target: profilePreferences.userId,
        set: { minAge: input.minAge, maxAge: input.maxAge, maxDistanceKm: input.maxDistanceKm, updatedAt: new Date() },
      });

    return NextResponse.json({ profile, status: profile.status }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Impossible d'enregistrer le profil." }, { status: 503 });
  }
}
