import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { adminActions, contactMessages } from "@/db/schema";
import { getAdminUserId } from "@/lib/auth/authorization";
import { getDatabase } from "@/lib/db";

const updateInput = z.object({ id: z.uuid(), status: z.enum(["open", "closed"]) });

export async function GET() {
  try {
    if (!(await getAdminUserId("contact"))) return NextResponse.json({ error: "Permission contact requise." }, { status: 403 });
    const messages = await getDatabase().select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(200);
    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "Boîte de contact indisponible." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    const adminId = await getAdminUserId("contact");
    if (!adminId) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
    const parsed = updateInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Mise à jour invalide." }, { status: 400 });

    const [updated] = await getDatabase().update(contactMessages).set({ status: parsed.data.status })
      .where(eq(contactMessages.id, parsed.data.id))
      .returning({ id: contactMessages.id, status: contactMessages.status });
    if (!updated) return NextResponse.json({ error: "Message introuvable." }, { status: 404 });

    await getDatabase().insert(adminActions).values({ adminUserId: adminId, action: `contact_${parsed.data.status}`, metadata: { messageId: updated.id } });
    return NextResponse.json({ message: updated });
  } catch {
    return NextResponse.json({ error: "Impossible de mettre à jour le message." }, { status: 503 });
  }
}
