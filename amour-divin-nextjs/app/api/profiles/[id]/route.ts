import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUserId } from "@/lib/auth/session";
import { getPublicProfile } from "@/lib/profiles/public";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const { id } = await context.params;
    if (!z.string().min(1).max(128).safeParse(id).success) return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });
    if (userId === id) return NextResponse.json({ error: "Utilisez votre espace de réglages." }, { status: 400 });

    const profile = await getPublicProfile(id);
    if (!profile) return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Service de profil indisponible." }, { status: 503 });
  }
}
