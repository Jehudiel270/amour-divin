import "server-only";

import { eq } from "drizzle-orm";

import { notifications, profilePreferences } from "@/db/schema";
import { getDatabase } from "@/lib/db";

type NotificationKind = "request" | "match" | "message";

const preferenceForKind = {
  request: profilePreferences.notifyRequests,
  match: profilePreferences.notifyMatches,
  message: profilePreferences.notifyMessages,
};

export async function createInAppNotification(userId: string, kind: NotificationKind, text: string) {
  const db = getDatabase();
  const [preferences] = await db.select({ enabled: preferenceForKind[kind] })
    .from(profilePreferences)
    .where(eq(profilePreferences.userId, userId))
    .limit(1);

  if (preferences?.enabled === false) return;

  await db.insert(notifications).values({
    userId,
    kind,
    payload: { text },
  });
}