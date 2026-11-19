import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { profilePhotos } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth/session";
import { getCloudinary } from "@/lib/cloudinary";
import { getDatabase } from "@/lib/db";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const { id } = await context.params;
    if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Photo invalide." }, { status: 400 });

    const db = getDatabase();
    const [photo] = await db.select().from(profilePhotos)
      .where(and(eq(profilePhotos.id, id), eq(profilePhotos.userId, userId))).limit(1);
    if (!photo) return NextResponse.json({ error: "Photo introuvable." }, { status: 404 });

    const result = await getCloudinary().uploader.destroy(photo.publicId, { invalidate: true });
    if (result.result !== "ok" && result.result !== "not found") {
      return NextResponse.json({ error: "La suppression du fichier a échoué." }, { status: 502 });
    }

    await db.delete(profilePhotos).where(and(eq(profilePhotos.id, id), eq(profilePhotos.userId, userId)));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Impossible de supprimer la photo." }, { status: 503 });
  }
}
