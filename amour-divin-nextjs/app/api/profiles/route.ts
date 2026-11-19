import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUserId } from "@/lib/auth/session";
import { listPublicProfiles } from "@/lib/profiles/public";

const queryInput = z.object({
  city: z.string().trim().max(120).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(24),
});

export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const url = new URL(request.url);
    const parsed = queryInput.safeParse({
      city: url.searchParams.get("city") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });
    if (!parsed.success) return NextResponse.json({ error: "Filtres invalides." }, { status: 400 });

    const results = await listPublicProfiles(parsed.data.city, parsed.data.limit);
    return NextResponse.json({ profiles: results.filter((profile) => profile.id !== userId) });
  } catch {
    return NextResponse.json({ error: "Service de découverte indisponible." }, { status: 503 });
  }
}
