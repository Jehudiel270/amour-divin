import { and, desc, eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { notifications } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";

const updateInput = z.object({ notificationId: z.uuid().optional() });

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const items = await getDatabase().select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(100);
    return NextResponse.json({ notifications: items });
  } catch {
    return NextResponse.json({ error: "Notifications indisponibles." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const parsed = updateInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Mise à jour invalide." }, { status: 400 });

    const db = getDatabase();
    if (parsed.data.notificationId) {
      await db.update(notifications).set({ readAt: new Date() })
        .where(and(eq(notifications.id, parsed.data.notificationId), eq(notifications.userId, userId), isNull(notifications.readAt)));
    } else {
      await db.update(notifications).set({ readAt: new Date() })
        .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Impossible de mettre à jour les notifications." }, { status: 503 });
  }
}
