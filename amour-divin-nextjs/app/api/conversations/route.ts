import { and, desc, eq, isNull, ne } from "drizzle-orm";
import { NextResponse } from "next/server";

import { conversationMembers, messages } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";
import { getPublicProfile } from "@/lib/profiles/public";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: "Authentification requise." }, { status: 401 });

    const db = getDatabase();
    const memberships = await db.select({ conversationId: conversationMembers.conversationId })
      .from(conversationMembers).where(eq(conversationMembers.userId, userId));

    const items = await Promise.all(memberships.map(async ({ conversationId }) => {
      const members = await db.select({ userId: conversationMembers.userId })
        .from(conversationMembers).where(eq(conversationMembers.conversationId, conversationId));
      const otherUserId = members.find((member) => member.userId !== userId)?.userId;
      if (!otherUserId) return null;

      const person = await getPublicProfile(otherUserId);
      if (!person) return null;

      const [lastMessage] = await db.select({ content: messages.content, createdAt: messages.createdAt, senderId: messages.senderId })
        .from(messages).where(eq(messages.conversationId, conversationId))
        .orderBy(desc(messages.createdAt)).limit(1);
      const unread = await db.select({ id: messages.id }).from(messages)
        .where(and(eq(messages.conversationId, conversationId), ne(messages.senderId, userId), isNull(messages.readAt)));

      return { id: conversationId, profile: { ...person, userId: person.id }, lastMessage: lastMessage ?? null, unreadCount: unread.length };
    }));

    return NextResponse.json({ conversations: items.filter((item) => item !== null) });
  } catch {
    return NextResponse.json({ error: "Service de conversations indisponible." }, { status: 503 });
  }
}
