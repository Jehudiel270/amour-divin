import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { profilePreferences, profiles } from "@/db/schema";
import { getCurrentUserId, getSession } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";

const settingsInput = z.object({
  firstName: z.string().trim().min(1).max(80),
  city: z.string().trim().max(120),
  isVisible: z.boolean(),
  notifications: z.object({
    matches: z.boolean(),
    messages: z.boolean(),
    requests: z.boolean(),
    marketing: z.boolean(),
  }),
});

const defaultNotifications = {
  matches: true,
  messages: true,
  requests: true,
  marketing: false,
};

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const db = getDatabase();
    const [[profile], [preferences], session] = await Promise.all([
      db.select({ firstName: profiles.firstName, city: profiles.city, isVisible: profiles.isVisible })
        .from(profiles).where(eq(profiles.userId, userId)).limit(1),
      db.select({
        matches: profilePreferences.notifyMatches,
        messages: profilePreferences.notifyMessages,
        requests: profilePreferences.notifyRequests,
        marketing: profilePreferences.notifyMarketing,
      }).from(profilePreferences).where(eq(profilePreferences.userId, userId)).limit(1),
      getSession(),
    ]);

    if (!profile) return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });
    return NextResponse.json({
      profile,
      email: session?.user?.email ?? "",
      notifications: preferences ?? defaultNotifications,
    });
  } catch {
    return NextResponse.json({ error: "Impossible de charger vos réglages." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const parsed = settingsInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Réglages invalides." }, { status: 400 });

    const db = getDatabase();
    const [profile] = await db.update(profiles)
      .set({
        firstName: parsed.data.firstName,
        city: parsed.data.city,
        isVisible: parsed.data.isVisible,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning({ firstName: profiles.firstName, city: profiles.city, isVisible: profiles.isVisible });

    if (!profile) return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });

    const notifications = parsed.data.notifications;
    await db.insert(profilePreferences).values({
      userId,
      notifyMatches: notifications.matches,
      notifyMessages: notifications.messages,
      notifyRequests: notifications.requests,
      notifyMarketing: notifications.marketing,
    }).onConflictDoUpdate({
      target: profilePreferences.userId,
      set: {
        notifyMatches: notifications.matches,
        notifyMessages: notifications.messages,
        notifyRequests: notifications.requests,
        notifyMarketing: notifications.marketing,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ profile, notifications });
  } catch {
    return NextResponse.json({ error: "Impossible d’enregistrer vos réglages." }, { status: 503 });
  }
}