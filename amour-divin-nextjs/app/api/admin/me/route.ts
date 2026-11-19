import { NextResponse } from "next/server";

import { getAdminContext } from "@/lib/auth/authorization";

export async function GET() {
  try {
    const context = await getAdminContext();
    if (!context) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
    return NextResponse.json(context);
  } catch {
    return NextResponse.json({ error: "Impossible de charger le rôle administrateur." }, { status: 503 });
  }
}
