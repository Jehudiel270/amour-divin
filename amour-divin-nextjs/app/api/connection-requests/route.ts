import { and, eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { blocks, connectionRequests, conversationMembers, conversations, matches, profiles } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";
import { createInAppNotification } from "@/lib/notifications/create";
import { getPublicProfile } from "@/lib/profiles/public";

const createSchema = z.object({
  recipientId: z.string().min(1).max(128),
  message: z.string().trim().max(500).default(""),
});
const updateSchema = z.object({
  requestId: z.uuid(),
  status: z.enum(["accepted", "declined", "withdrawn"]),
});

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const rows = await getDatabase().select().from(connectionRequests)
      .where(or(eq(connectionRequests.senderId, userId), eq(connectionRequests.recipientId, userId)));
    const requests = await Promise.all(rows.map(async (row) => {
      const direction = row.senderId === userId ? "sent" : "received";
      const otherUserId = direction === "sent" ? row.recipientId : row.senderId;
      const profile = await getPublicProfile(otherUserId);
      return profile ? { ...profile, requestId: row.id, direction, status: row.status, message: row.message, createdAt: row.createdAt } : null;
    }));
    return NextResponse.json({ requests: requests.filter((request) => request !== null) });
  } catch {
    return NextResponse.json({ error: "Service des demandes indisponible." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Demande invalide." }, { status: 400 });
    if (parsed.data.recipientId === userId) return NextResponse.json({ error: "Vous ne pouvez pas vous envoyer une demande." }, { status: 400 });

    const db = getDatabase();
    const [target] = await db.select({ userId: profiles.userId }).from(profiles)
      .where(and(eq(profiles.userId, parsed.data.recipientId), eq(profiles.status, "active"), eq(profiles.isVisible, true)))
      .limit(1);
    if (!target) return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });

    const [blocked] = await db.select({ blockerId: blocks.blockerId }).from(blocks)
      .where(or(
        and(eq(blocks.blockerId, userId), eq(blocks.blockedId, target.userId)),
        and(eq(blocks.blockerId, target.userId), eq(blocks.blockedId, userId)),
      )).limit(1);
    if (blocked) return NextResponse.json({ error: "Cette action n'est pas disponible." }, { status: 403 });

    const [created] = await db.insert(connectionRequests).values({
      senderId: userId,
      recipientId: target.userId,
      message: parsed.data.message,
    }).onConflictDoNothing().returning();

    if (!created) return NextResponse.json({ error: "Une demande est déjà en attente." }, { status: 409 });
    await createInAppNotification(target.userId, "request", "Vous avez reçu une demande de connexion.");
    return NextResponse.json({ request: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Impossible d'envoyer la demande." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Mise à jour invalide." }, { status: 400 });

    const db = getDatabase();
    const [updated] = await db.update(connectionRequests)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(and(
        eq(connectionRequests.id, parsed.data.requestId),
        eq(connectionRequests.status, "pending"),
        parsed.data.status === "withdrawn" ? eq(connectionRequests.senderId, userId) : eq(connectionRequests.recipientId, userId),
      ))
      .returning();

    if (!updated) return NextResponse.json({ error: "Demande introuvable ou déjà traitée." }, { status: 404 });

    if (updated.status === "accepted") {
      const [userAId, userBId] = [updated.senderId, updated.recipientId].sort();
      const [createdMatch] = await db.insert(matches).values({ userAId, userBId }).onConflictDoNothing().returning();
      const [match] = createdMatch
        ? [createdMatch]
        : await db.select().from(matches).where(and(eq(matches.userAId, userAId), eq(matches.userBId, userBId))).limit(1);
      if (match) {
        const [createdConversation] = await db.insert(conversations).values({ matchId: match.id }).onConflictDoNothing().returning();
        const [conversation] = createdConversation
          ? [createdConversation]
          : await db.select().from(conversations).where(eq(conversations.matchId, match.id)).limit(1);
        if (conversation) {
          await db.insert(conversationMembers).values([
            { conversationId: conversation.id, userId: userAId },
            { conversationId: conversation.id, userId: userBId },
          ]).onConflictDoNothing();
        }
      }
      await Promise.all([
        createInAppNotification(updated.senderId, "match", "Votre demande de connexion a été acceptée."),
        createInAppNotification(updated.recipientId, "match", "Vous avez créé une nouvelle connexion."),
      ]);
    }

    return NextResponse.json({ request: updated });
  } catch {
    return NextResponse.json({ error: "Impossible de mettre à jour la demande." }, { status: 503 });
  }
}
