import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { profilePhotos, profiles } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth/session";
import { getCloudinary } from "@/lib/cloudinary";
import { getDatabase } from "@/lib/db";

const uploadInput = z.object({
  publicId: z.string().min(1).max(255),
  version: z.number().int().positive(),
  signature: z.string().min(1),
  position: z.number().int().min(0).max(5),
});

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const photos = await getDatabase().select({
      id: profilePhotos.id,
      secureUrl: profilePhotos.secureUrl,
      position: profilePhotos.position,
      status: profilePhotos.status,
    }).from(profilePhotos).where(eq(profilePhotos.userId, userId));

    return NextResponse.json({ photos });
  } catch {
    return NextResponse.json({ error: "Service photo indisponible." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const parsed = uploadInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Réponse d'upload invalide." }, { status: 400 });

    const { publicId, version, signature, position } = parsed.data;
    const cloudinary = getCloudinary();
    const expectedSignature = cloudinary.utils.api_sign_request({ public_id: publicId, version }, process.env.CLOUDINARY_API_SECRET!);
    if (signature !== expectedSignature || !publicId.startsWith(`eglise-amour-divin/profiles/${userId}/`)) {
      return NextResponse.json({ error: "Upload non vérifié." }, { status: 403 });
    }
    const secureUrl = cloudinary.url(publicId, { secure: true, version, resource_type: "image" });

    const db = getDatabase();
    const [profile] = await db.select({ userId: profiles.userId }).from(profiles).where(eq(profiles.userId, userId)).limit(1);
    if (!profile) return NextResponse.json({ error: "Enregistrez d'abord votre brouillon de profil." }, { status: 409 });

    const [existing] = await db.select({ id: profilePhotos.id, publicId: profilePhotos.publicId }).from(profilePhotos)
      .where(and(eq(profilePhotos.userId, userId), eq(profilePhotos.position, position))).limit(1);
    const [photo] = await db.insert(profilePhotos).values({
      userId,
      publicId,
      secureUrl,
      position,
      status: "pending",
    }).onConflictDoUpdate({
      target: [profilePhotos.userId, profilePhotos.position],
      set: { publicId, secureUrl, status: "pending", createdAt: new Date() },
    }).returning({ id: profilePhotos.id, status: profilePhotos.status, position: profilePhotos.position, secureUrl: profilePhotos.secureUrl });

    if (existing && existing.publicId !== publicId) {
      await cloudinary.uploader.destroy(existing.publicId, { invalidate: true });
    }

    return NextResponse.json({ photo }, { status: existing ? 200 : 201 });
  } catch {
    return NextResponse.json({ error: "Impossible d'enregistrer la photo." }, { status: 503 });
  }
}
