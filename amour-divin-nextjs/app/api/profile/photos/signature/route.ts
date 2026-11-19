import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUserId } from "@/lib/auth/session";
import { getCloudinary } from "@/lib/cloudinary";

const signatureInput = z.object({ position: z.number().int().min(0).max(5) });

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const parsed = signatureInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Position de photo invalide." }, { status: 400 });

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `eglise-amour-divin/profiles/${userId}`;
    const publicId = `photo-${parsed.data.position}-${crypto.randomUUID()}`;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    if (!uploadPreset) throw new Error("La variable CLOUDINARY_UPLOAD_PRESET n’est pas configurée.");
    const params = { timestamp, folder, public_id: publicId, upload_preset: uploadPreset, overwrite: false };
    const cloudinary = getCloudinary();
    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);

    return NextResponse.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      folder,
      publicId,
      uploadPreset,
      signature,
    });
  } catch {
    return NextResponse.json({ error: "Service photo indisponible." }, { status: 503 });
  }
}
