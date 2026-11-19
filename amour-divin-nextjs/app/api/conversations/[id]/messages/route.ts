import { and, desc, eq, isNull, ne, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { blocks, conversationMembers, conversations, messages, notifications, profiles } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";

const messageInput = z.object({ content: z.string().trim().min(1).max(4000) });

async function getMembership(conversationId: string, userId: string) {
  const [membership] = await getDatabase().select().from(conversationMembers)
    .where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, userId)))
    .limit(1);
  return membership;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
    const { id } = await context.params;
    if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Conversation introuvable." }, { status: 404 });
    if (!(await getMembership(id, userId))) return NextResponse.json({ error: "Conversation introuvable." }, { status: 404 });

    const db = getDatabase();
    const rows = await db.select({
      id: messages.id,
      senderId: messages.senderId,
      senderName: profiles.firstName,
      content: messages.content,
      createdAt: messages.createdAt,
    }).from(messages)
      .innerJoin(profiles, eq(messages.senderId, profiles.userId))
      .where(eq(messages.conversationId, id))
      .orderBy(desc(messages.createdAt))
      .limit(50);

    await db.update(messages).set({ readAt: new Date() })
      .where(and(eq(messages.conversationId, id), ne(messages.senderId, userId), isNull(messages.readAt)));

    return NextResponse.json({ messages: rows.reverse().map((message) => ({
      ...message,
      time: message.createdAt.toISOString(),
      isMine: message.senderId === userId,
    })) });
  } catch {
    return NextResponse.json({ error: "Impossible de charger les messages." }, { status: 503 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
    const { id } = await context.params;
    if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Conversation introuvable." }, { status: 404 });
    if (!(await getMembership(id, userId))) return NextResponse.json({ error: "Conversation introuvable." }, { status: 404 });

    const parsed = messageInput.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Message invalide." }, { status: 400 });

    const db = getDatabase();
    const members = await db.select({ userId: conversationMembers.userId }).from(conversationMembers)
      .where(eq(conversationMembers.conversationId, id));
    const otherUserId = members.find((member) => member.userId !== userId)?.userId;
    if (!otherUserId) return NextResponse.json({ error: "Conversation introuvable." }, { status: 404 });

    const [block] = await db.select({ blockerId: blocks.blockerId }).from(blocks)
      .where(or(
        and(eq(blocks.blockerId, userId), eq(blocks.blockedId, otherUserId)),
        and(eq(blocks.blockerId, otherUserId), eq(blocks.blockedId, userId)),
      )).limit(1);
    if (block) return NextResponse.json({ error: "Cette conversation n'est plus disponible." }, { status: 403 });

    const [message] = await db.insert(messages).values({
      conversationId: id,
      senderId: userId,
      content: parsed.data.content,
    }).returning();
    await db.update(conversations).set({ updatedAt: new Date() }).where(eq(conversations.id, id));
    await db.insert(notifications).values({
      userId: otherUserId,
      kind: "message",
      payload: { text: "Vous avez reçu un nouveau message." },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Impossible d'envoyer le message." }, { status: 503 });
  }
}
